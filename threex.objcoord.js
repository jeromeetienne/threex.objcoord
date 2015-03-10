var THREEx	= THREEx	|| {}

THREEx.ObjCoord	= function(object3d){
	this.screenPosition	= function(camera){
		return THREEx.ObjCoord.screenPosition(object3d, camera)
	}
	this.worldPosition	= function(){
		return THREEx.ObjCoord.worldPosition(object3d)
	}
	this.cssPosition	= function(renderer, camera){
		return THREEx.ObjCoord.cssPosition(object3d, renderer, camera)
	}
	return this
}


/**
 * get the world position
 * @return {THREE.Vector3}	the world position
 */
THREEx.ObjCoord.worldPosition	= function(object3d){
	object3d.updateMatrixWorld();
	var worldMatrix	= object3d.matrixWorld;
	var worldPos	= new THREE.Vector3().setFromMatrixPosition(worldMatrix);
	return worldPos;
}

/**
 * get screen position
 * 
 * @param  {THREE.Object3D} object3d	the object3damera used to render
 * @param  {THREE.Camera} camera	the camera used to render
 * @return {THREE.Vector3}			the screen position
 */
THREEx.ObjCoord.screenPosition	= function(object3d, camera){
	var position	= this.worldPosition(object3d)
	return this.convertWorldToScreenSpace(position, camera)
}


/**
 * get css position
 * 
 * @param  {THREE.Object3D} object3d	the object3damera used to render
 * @param  {THREE.Renderer} renderer	the renderer used to render
 * @param  {THREE.Camera} camera	the camera used to render
 * @return {THREE.Vector3}		the screen position
 */
THREEx.ObjCoord.cssPosition	= function(object3d, camera, renderer){
	var position	= this.screenPosition(object3d, camera);
	position.x	= (  (position.x/2 + 0.5)) * renderer.domElement.width / renderer.getPixelRatio();
	position.y	= (1-(position.y/2 + 0.5)) * renderer.domElement.height/ renderer.getPixelRatio();
	return position;
}



/**
 * convert world position to screen space
 * 
 * @param  {THREE.Vector3}	worldPosition	the world position
 * @param  {THREE.Camera}	tCamera       	the camera used to render
 * @return {THREE.Vector3}			the screen space position [-1, +1]
 */
THREEx.ObjCoord.convertWorldToScreenSpace	= function(worldPosition, camera){
	// init projector if needed 
	var projector	= this.projector || new THREE.Projector();
	this.projector	= projector
	// compute screenPos
	var screenPos	= worldPosition.clone().project( camera );
	return screenPos;
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

/** 
 * return the visible height *in 3d* of the plane facing the camera.
 * from http://stackoverflow.com/questions/13350875/three-js-width-of-view
 * 
 * @param {THREE.Camera} camera         current camera
 * @param {Number} distanceToCamera 	distance from the object to the camera
 */
THREEx.ObjCoord.VisiblePlaneHeight	= function(camera, distanceToCamera){
	var vFOV	= camera.fov * Math.PI / 180;		// convert vertical fov to radians
	var planeHeight	= 2 * Math.tan( vFOV / 2 ) * distanceToCamera;	// visible height
	return planeHeight
}

/** 
 * return the visible width *in 3d* of the plane facing the camera. 
 * It needs the renderer to get screen aspect.
 * from http://stackoverflow.com/questions/13350875/three-js-width-of-view
 * 
 * @param {THREE.Camera} camera         current camera
 * @param {THREE.Renderer} renderer     current renderer (to get screen aspect)
 * @param {Number} distanceToCamera 	distance from the object to the camera
 */
THREEx.ObjCoord.VisiblePlaneWidth	= function(camera, renderer, distanceToCamera){
	var planeHeight	= THREEx.ObjCoord.VisiblePlaneHeight(camera, distanceToCamera)
	var aspect	= renderer.domElement.width / renderer.domElement.height;
	var planeWidth	= planeHeight * aspect; 
	return planeWidth
}
