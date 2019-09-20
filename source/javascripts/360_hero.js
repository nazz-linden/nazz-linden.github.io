(function() {

  var camera, scene, renderer, material;

  var fov = 70,
    texture_placeholder,
    isUserInteracting = false,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    lon = 0,
    onMouseDownLon = 0,
    lat = 0,
    onMouseDownLat = 0,
    phi = 0,
    theta = 0;

  init();
  animate();


  function getSphericalUrl(){
    return document.getElementById('spherical-img').attributes.src.value;
  }

  function getTargetElement(){
    return document.getElementById('hero-theta');
  }

  function init() {


    // get target
    var targetElement, mesh;
    targetElement = getTargetElement();

    // setup camera
    camera = new THREE.PerspectiveCamera(fov, targetElement.offsetWidth / targetElement.offsetHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    // setup scene
    scene = new THREE.Scene();

    // wrap image
    var geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    material = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(getSphericalUrl())
    });
    mesh = new THREE.Mesh(geometry, material);

    // add to scene
    scene.add(mesh);

    // render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(targetElement.offsetWidth, targetElement.offsetHeight);
    targetElement.appendChild(renderer.domElement);

    // events
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize() {
    var targetElement = getTargetElement();
    camera.aspect = targetElement.offsetWidth / targetElement.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(targetElement.offsetWidth, targetElement.offsetHeight);
  }

  function onDocumentMouseDown(event) {
    if (underElement(getTargetElement(), event))
    {
      event.preventDefault();
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    }
  }

  function onDocumentMouseMove(event) {
    if (isUserInteracting) {
      lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }
  }

  function onDocumentMouseUp(event) {
    isUserInteracting = false;
  }

  function underElement(elem,e) {
     var elemWidth = $(elem).width();
     var elemHeight = $(elem).height();
     var elemPosition = $(elem).offset();
     var elemPosition2 = new Object;
     elemPosition2.top = elemPosition.top + elemHeight;
     elemPosition2.left = elemPosition.left + elemWidth;

     return ((e.pageX > elemPosition.left && e.pageX < elemPosition2.left) && (e.pageY > elemPosition.top && e.pageY < elemPosition2.top))
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  var rotation = 0;
  function render() {

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    if (!isUserInteracting)
    {
      rotation += 0.02;
      camera.rotation.x = 0;
      camera.rotation.z = 0;
      camera.rotation.y = rotation * Math.PI / 180;
    }
    renderer.render(scene, camera);

  }

})();

