const init = () => {

    let clock = new THREE.Clock()

    // SCENE
    let scene = new THREE.Scene()
    let gui = new dat.GUI()

    let isFog = false
    if (isFog) scene.fog = new THREE.FogExp2('#fff', .05)

    let boxes = getBoxGroup(10, 1, 1.5); boxes.name = 'main-boxes'
    let plane = getPlane(40); plane.name = 'main-plane';
    let light = getSpotLight(1, 2, 2)
    let sphere = getSphere(.05)
    // let helper = new THREE.CameraHelper(light.shadow.camera)

    plane.rotation.x = Math.PI / 2
    light.position.y = 15
    light.position.x = 10
    light.position.z = 10

    light.add(sphere)
    scene.add(boxes)
    scene.add(plane)
    scene.add(light)
    // scene.add(helper)

    gui.add(light, 'intensity', 0, 5)
    gui.add(light.position, 'y', 0, 20)
    gui.add(light.position, 'x', 0, 20)
    gui.add(light.position, 'z', 0, 20)
    // gui.add(light, 'penumbra', 0, 1)


    // CAMERA
    let camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1, 1000
        
    )

    // let camera = new THREE.OrthographicCamera(
    //     -15, 15, 15, -15,
    //     1, 1000
    // )

    camera.position.z = 5
    camera.position.x = 2;
    camera.position.y = 2;

    camera.lookAt(new THREE.Vector3(0, 0, 0))


    // RENDERER
    let renderer = new THREE.WebGLRenderer()

    renderer.shadowMap.enabled = true
    renderer.setSize(innerWidth, innerHeight)
    renderer.setClearColor('#7F7D7F')

    let controls = new THREE.OrbitControls(camera, renderer.domElement)

    update(renderer, scene, camera, controls, clock)


    // 
    document.querySelector('#webgl').appendChild(renderer.domElement)
    return scene
}


// functions
const update = (renderer, scene, camera, controls, clock) => {
    renderer.render(scene, camera)

    // controls.update()
    let timeElapsed = clock.getElapsedTime()
    // console.log(timeElapsed)

    let boxes = scene.getObjectByName('main-boxes')
    boxes.children.forEach((child, index) => {
        child.scale.y = Math.abs(noise.simplex2(timeElapsed * 5 + index, timeElapsed * 5 + index))
        child.position.y = child.scale.y / 2
    })

    requestAnimationFrame(() => update(renderer, scene, camera, controls, clock))
}

// lights
const getPointLight = (intensity) => {
    let pointLight = new THREE.PointLight('#fff', intensity)
    pointLight.castShadow = true
    return pointLight
}

const getSpotLight = (intensity) => {
    let spotLight = new THREE.SpotLight('#fff', intensity)
    spotLight.castShadow = true
    spotLight.shadow.bias = .001
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048
    spotLight.penumbra = .5
    return spotLight
}

const getDirectionalLight = (intensity) => {
    let directionalLight = new THREE.DirectionalLight('#fff', intensity)
    directionalLight.castShadow = true

    directionalLight.shadow.camera.left = -15
    directionalLight.shadow.camera.bottom = -15
    directionalLight.shadow.camera.right = 15
    directionalLight.shadow.camera.top = 15

    return directionalLight
}

const getAmbientLight = (intensity) => {
    let ambientLight = new THREE.AmbientLight('#fff', intensity)
    return ambientLight
}

const getRectAreaLight = (intensity, width, height) => {
    let rectAreaLight = new THREE.RectAreaLight('#fff', intensity, width, height)
    rectAreaLight.lookAt(0, 0, 0)
    rectAreaLight.position.set(5, 5, 0);
    return rectAreaLight
}

const getSphere = (size) => {

    let geometry = new THREE.SphereGeometry(size, 20, 20)
    let material = new THREE.MeshBasicMaterial({ color: '#fff' })

    let sphere = new THREE.Mesh(geometry, material)

    return sphere
}

// objs
const getBox = (w, h, d) => {
    console.log('getBox')

    let geometry = new THREE.BoxGeometry(w, h, d)
    let material = new THREE.MeshPhongMaterial({
        color: '#278BCE'
    })

    let mesh = new THREE.Mesh(geometry, material)

    mesh.castShadow = true

    return mesh
}

const getPlane = (size) => {

    let geometry = new THREE.PlaneGeometry(size, size)
    let material = new THREE.MeshPhongMaterial({
        color: 0x8AE22E,
        side: THREE.DoubleSide
    })

    let mesh = new THREE.Mesh(geometry, material)

    mesh.receiveShadow = true

    return mesh
}

const getBoxGroup = (number, size, distance) => {
    let boxGroup = new THREE.Group()

    for (let i = 0; i < number; ++i) {
        let box = getBox(size, size, size)
        box.position.y = box.geometry.parameters.height / 2
        box.position.x = distance * i
        boxGroup.add(box)

        for (let j = 0; j < number; ++j) {
            let box = getBox(size, size, size)
            box.position.x = distance * i
            box.position.y = box.geometry.parameters.height / 2
            box.position.z = j * distance
            boxGroup.add(box)
        }
    }

    boxGroup.position.z = - distance * (number - 1) / 2
    boxGroup.position.x = - distance * (number - 1) / 2

    return boxGroup
}

// run
let scene = init()