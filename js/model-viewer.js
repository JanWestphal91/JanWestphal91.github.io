// ═══ 3D-Viewer für Projektseiten ══════════════════════════════════════
//
// Jedes <article class="jw-model" data-model-src="…glb"> wird zu einem
// drehbaren 3D-Modell. three.js (rund 700 KB) und das Modell laden erst,
// wenn der Viewer in die Nähe des sichtbaren Bereichs kommt.
//
// Funktionen:
//   - Drehen, Zoomen, Verschieben (Maus, Touch, Pfeiltasten)
//   - Animationen aus der Datei auswählen und abspielen
//   - Ansicht „Topologie“: helles Material mit den Kanten des Modells
//
// Topologie: WebGL zeichnet nur Dreiecke, jedes Quad besteht also aus zwei
// Dreiecken mit einer Diagonale. Damit nur die echten Kanten aus Blender
// erscheinen, schreibt das Export-Skript (_build/blender-export-glb.py) an
// jede Dreiecksecke das Attribut _EDGE: 1 = die gegenüberliegende Kante ist
// eine echte Kante, 0 = Diagonale. Der Shader unten zeichnet eine Linie nur
// dort, wo der Abstand zu einer echten Kante klein ist (baryzentrische
// Koordinaten). Fehlt _EDGE, werden alle Dreieckskanten gezeichnet.
//
// Ist „Animationen aus“ aktiv, dreht sich nichts von selbst und Animationen
// starten erst auf Knopfdruck.

const VENDOR = "/js/vendor/three/";
const lang = document.documentElement.lang === "en" ? "en" : "de";
const motionOff = () => document.documentElement.classList.contains("jw-motion-off");

// Texte, die erst zur Laufzeit entstehen (die festen stehen im HTML)
const TXT = {
    de: { loading: "Modell wird geladen …", error: "Das Modell konnte nicht geladen werden.", play: "Abspielen", pause: "Pause",
          faces: "Flächen", quads: "Quads", tris: "Dreiecke", verts: "Punkte", anims: "Animationen", anim1: "Animation" },
    en: { loading: "Loading model …", error: "The model could not be loaded.", play: "Play", pause: "Pause",
          faces: "faces", quads: "quads", tris: "triangles", verts: "vertices", anims: "animations", anim1: "animation" }
}[lang];
const nf = new Intl.NumberFormat(lang === "en" ? "en-GB" : "de-DE");

let libs = null;
function loadLibs() {
    if (!libs) {
        libs = Promise.all([
            import(VENDOR + "three.module.min.js"),
            import(VENDOR + "addons/controls/OrbitControls.js"),
            import(VENDOR + "addons/loaders/GLTFLoader.js"),
            import(VENDOR + "addons/libs/meshopt_decoder.module.js")
        ]).then(function (m) {
            return { THREE: m[0], OrbitControls: m[1].OrbitControls, GLTFLoader: m[2].GLTFLoader, MeshoptDecoder: m[3].MeshoptDecoder };
        });
    }
    return libs;
}

// Farben aus dem Stylesheet, damit der Viewer zum Rest der Seite passt
function cssColor(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
}

// ── Geometrie für die Topologie-Ansicht vorbereiten ──
// Nicht indizierte Kopie (jedes Dreieck hat eigene Ecken), dazu pro Ecke
// "bary" (1,0,0)/(0,1,0)/(0,0,1) und "edgeMask": welche der drei Kanten
// des Dreiecks gezeichnet werden.
function prepareTopology(THREE, geometry) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    const count = g.attributes.position.count;
    const bary = new Float32Array(count * 3);
    const mask = new Float32Array(count * 3);
    const edge = g.getAttribute("_edge");
    for (let t = 0; t < count; t += 3) {
        // Kante gegenüber Ecke k: Flag an Ecke k (siehe Kopfkommentar)
        const e0 = edge ? (edge.getX(t) > 0.5 ? 1 : 0) : 1;
        const e1 = edge ? (edge.getX(t + 1) > 0.5 ? 1 : 0) : 1;
        const e2 = edge ? (edge.getX(t + 2) > 0.5 ? 1 : 0) : 1;
        for (let k = 0; k < 3; k++) {
            const i = (t + k) * 3;
            bary[i + k] = 1;
            mask[i] = e0; mask[i + 1] = e1; mask[i + 2] = e2;
        }
    }
    g.setAttribute("bary", new THREE.BufferAttribute(bary, 3));
    g.setAttribute("edgeMask", new THREE.BufferAttribute(mask, 3));
    return g;
}

function topologyMaterial(THREE, fill, line) {
    const mat = new THREE.MeshLambertMaterial({ color: fill, side: THREE.DoubleSide });
    mat.onBeforeCompile = function (shader) {
        shader.uniforms.lineColor = { value: new THREE.Color(line) };
        shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\nattribute vec3 bary;\nattribute vec3 edgeMask;\nvarying vec3 vBary;\nvarying vec3 vMask;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBary = bary;\nvMask = edgeMask;");
        shader.fragmentShader = shader.fragmentShader
            .replace("#include <common>", "#include <common>\nuniform vec3 lineColor;\nvarying vec3 vBary;\nvarying vec3 vMask;")
            .replace("#include <dithering_fragment>",
                "#include <dithering_fragment>\n" +
                // Abstand zur Kante in Bildschirmpixeln, Linienbreite ca. 1 px
                "vec3 px = vBary / max(fwidth(vBary), vec3(1e-6));\n" +
                "vec3 on = (1.0 - smoothstep(0.0, 1.1, px)) * vMask;\n" +
                "float l = max(max(on.x, on.y), on.z);\n" +
                "gl_FragColor.rgb = mix(gl_FragColor.rgb, lineColor, l * 0.85);");
    };
    return mat;
}

function clipLabel(name) {
    const s = name.replace(/[-_]loop$/i, "").replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
}

async function initViewer(el) {
    const stage = el.querySelector(".jw-model__stage");
    const canvas = el.querySelector("canvas");
    const status = el.querySelector(".jw-model__status");
    const statsEl = el.querySelector(".jw-model__stats");
    const modeBtns = el.querySelectorAll("[data-model-mode]");
    const animWrap = el.querySelector(".jw-model__anim");
    const select = el.querySelector(".jw-model__anim select");
    const playBtn = el.querySelector("[data-model-play]");
    const resetBtn = el.querySelector("[data-model-reset]");

    status.textContent = TXT.loading;
    let L;
    try { L = await loadLibs(); } catch (e) { status.textContent = TXT.error; return; }
    const THREE = L.THREE;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a857c, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(3, 5, 4);
    scene.add(sun);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const controls = new L.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.autoRotateSpeed = 0.8;
    controls.listenToKeyEvents(canvas);
    controls.keyPanSpeed = 12;
    controls.addEventListener("start", function () { controls.autoRotate = false; });
    // Mausrad zoomt erst nach einem Klick ins Modell, sonst bliebe die Seite
    // beim Scrollen über dem Viewer hängen
    controls.enableZoom = false;
    canvas.addEventListener("pointerdown", function () { controls.enableZoom = true; });
    canvas.addEventListener("focus", function () { controls.enableZoom = true; });
    canvas.addEventListener("pointerleave", function () { if (document.activeElement !== canvas) controls.enableZoom = false; });
    canvas.addEventListener("blur", function () { controls.enableZoom = false; });

    const loader = new L.GLTFLoader();
    loader.setMeshoptDecoder(L.MeshoptDecoder);
    let gltf;
    try {
        gltf = await loader.loadAsync(el.dataset.modelSrc);
    } catch (e) {
        status.textContent = TXT.error;
        renderer.dispose();
        return;
    }
    const root = gltf.scene;
    scene.add(root);

    // Materialien merken, Topologie-Material pro Mesh vorbereiten
    const ink = cssColor("--ink", "#111111");
    const paper = cssColor("--paper", "#F8F7F3");
    const topoMat = topologyMaterial(THREE, paper, ink);
    const meshes = [];
    let triCount = 0;
    root.traverse(function (o) {
        if (!o.isMesh) return;
        o.geometry = prepareTopology(THREE, o.geometry);
        triCount += o.geometry.attributes.position.count / 3;
        o.userData.jwMat = o.material;
        o.frustumCulled = false;       // Hüllkörper passen bei Animationen nicht immer
        meshes.push(o);
    });

    // Ansicht umschalten
    function setMode(mode) {
        meshes.forEach(function (m) { m.material = mode === "topology" ? topoMat : m.userData.jwMat; });
        modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.modelMode === mode)); });
    }
    modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.modelMode); }); });

    // Animationen
    let mixer = null, action = null, playing = false;
    const clips = gltf.animations || [];
    function setPlaying(on) {
        playing = on;
        if (action) action.paused = !on;
        playBtn.setAttribute("aria-pressed", String(on));
        playBtn.textContent = on ? TXT.pause : TXT.play;
    }
    function playClip(i) {
        const next = mixer.clipAction(clips[i]);
        next.reset().play();
        if (action && action !== next) action.crossFadeTo(next, 0.25, false);
        action = next;
        setPlaying(true);
    }
    if (clips.length) {
        mixer = new THREE.AnimationMixer(root);
        clips.forEach(function (c, i) {
            const o = document.createElement("option");
            o.value = String(i);
            o.textContent = clipLabel(c.name);
            select.appendChild(o);
        });
        // Mit einer Ruhe-Animation beginnen, wenn es eine gibt
        let start = clips.findIndex(function (c) { return /idle/i.test(c.name); });
        if (start < 0) start = 0;
        select.value = String(start);
        animWrap.hidden = false;
        playBtn.hidden = false;
        select.addEventListener("change", function () { playClip(Number(select.value)); });
        playBtn.addEventListener("click", function () {
            if (!action) playClip(Number(select.value));
            else setPlaying(!playing);
        });
        // Erste Pose anwenden, damit die Kamera zur Haltung passt (die
        // Ruhepose des Rigs ist oft breiter, z. B. mit ausgebreiteten Flügeln)
        playClip(start);
        mixer.update(0);
        if (motionOff()) setPlaying(false);
    }

    // Kamera auf das Modell ausrichten (genau, also mit der Pose des Rigs)
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root, true);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1;
    const dist = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.2;
    const home = { pos: new THREE.Vector3(center.x + dist * 0.62, center.y + dist * 0.32, center.z + dist * 0.72), target: center.clone() };
    camera.near = dist / 100; camera.far = dist * 20; camera.updateProjectionMatrix();
    function resetView() {
        camera.position.copy(home.pos);
        controls.target.copy(home.target);
        controls.update();
    }
    resetView();
    controls.autoRotate = !motionOff();


    resetBtn.addEventListener("click", resetView);

    // Kennzahlen: aus der Datei (Export-Skript) oder aus der Geometrie
    const t = root.userData && root.userData.jw_topology;
    const parts = [];
    if (t && t.faces) {
        parts.push(nf.format(t.faces) + " " + TXT.faces);
        parts.push(Math.floor(t.quads / t.faces * 100) + " % " + TXT.quads);
        parts.push(nf.format(t.verts) + " " + TXT.verts);
    } else {
        parts.push(nf.format(Math.round(triCount)) + " " + TXT.tris);
    }
    if (clips.length) parts.push(clips.length + " " + (clips.length === 1 ? TXT.anim1 : TXT.anims));
    statsEl.textContent = parts.join(" · ");

    // Größe an den Rahmen anpassen
    function resize() {
        const w = stage.clientWidth, h = stage.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage);
    resize();

    // Nur zeichnen, solange der Viewer sichtbar ist
    const clock = new THREE.Clock();
    let visible = true, raf = 0;
    function frame() {
        raf = 0;
        if (!visible) return;
        const dt = clock.getDelta();
        if (mixer && playing) mixer.update(dt);
        if (motionOff()) controls.autoRotate = false;
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
    }
    new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !raf) { clock.getDelta(); raf = requestAnimationFrame(frame); }
    }).observe(stage);

    status.textContent = "";
    el.classList.add("is-ready");
}

// Viewer starten, kurz bevor sie in den sichtbaren Bereich kommen
const viewers = document.querySelectorAll(".jw-model[data-model-src]");
if (viewers.length) {
    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            initViewer(entry.target);
        });
    }, { rootMargin: "300px 0px" });
    viewers.forEach(function (v) { io.observe(v); });
}
