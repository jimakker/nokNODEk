var createGame = require('voxel-hello-world')

var game = createGame({
	materials: ["#000000","#ff0000","#fff","#ff0","#00FF15","#FF00E1","#0026FF","#FF9D00"],
 	materialFlatColor: true,
 	fogDisabled : false,
 	lightsDisabled: true,
 	skyColor: '#000000',
 	chunkDistance: 3,
	generate: function(x, y, z) {

		return y === 1 ? 1 : 0
	}
})


window.cubes = [];


window.rotVel = 0.005
window.mvVel = 1
window.translateVel = 20

window.createIntervals = function(y, mat){
	window.zPos = 0;
	window.yPos = y || 0;
	window.interMat = mat ? mat : 0;
	setInterval(function(){
		for(var i=0;i<10;i++){
			game.setBlock([i*3,zPos,yPos],interMat);
		}
		zPos = zPos + 3;
		if(zPos>100) { clearInterval(this)}
	},100)
}

window.buildCube = function(material,randomColor){
	var newCube = [];
	for(var i=0;i<15;i++){
			for(var ii=0;ii<15;ii++){
				for(var iii=0;iii<15;iii++){
					if(randomColor) { 
						material = Math.floor(Math.random() * (7 - 2 + 1)) + 2
					}
					game.setBlock([i*9,iii*9,ii*9],material);
					newCube.push([i*9,iii*9,ii*9]);
				}
			}
	}
	cubes.push(newCube);
}


window.decayCube = {
	interval : null,
	start : function(cube,time){
		var t = time || 100
		var shCube = shuffle(cube)
		this.interval = setInterval(function(){
			if(shCube.length>0){
				game.setBlock(shCube.pop(),0)
			} else {
				clearInterval(this)
				console.log('CLEARED DECAY')
			}
		},t);
	},
	stop : function(){
		clearInterval(this.interval)
		console.log('CLEARED DECAY')
	}
}


window.unDecayCube = { 
	mat : null,
	interval : null,
	start : function(cube,material,time,randomColor){
		var t = time || 100
		var shCube = shuffle(cube);
		this.interval = setInterval(function(){
			if(shCube.length>0){
				if(randomColor) { 
					material = Math.floor(Math.random() * (7 - 2 + 1)) + 2
				}
				game.setBlock(shCube.pop(),material)
			} else {
				clearInterval(this)
				console.log('CLEARED UNDECAY')
			}	
		},t);
	},
	stop : function(){
		clearInterval(this.interval)
		console.log('CLEARED UNDECAY')
	}
}


window.setCameraRotationZ = function(rot){
	game.camera.rotation.z = rot * 0.04947637795;
}

window.setCameraRotationY = function(rot){
	game.camera.rotation.y = rot * 0.04947637795;
}

window.setCameraRotationX = function(rot){
	game.camera.rotation.x = rot * 0.04947637795;
}


window.switchCameraRotationX = {
	camRotXInterval : null,
	direction : 0,
	switch : function(cb){
		if(this.camRotXInterval){
			if(this.direction){
				clearInterval(this.camRotXInterval)
				this.camRotXInterval = null
				this.direction = 0
				cb(0)
			} else {
				clearInterval(this.camRotXInterval)
				this.camRotXInterval = setInterval(function(){
					game.camera.rotation.x -= window.rotVel
					window.sendCamRotX(game.camera.rotation.x)
				},50)
				this.direction = 1
				cb(-1)
			}
		} else {
			this.camRotXInterval = setInterval(function(){
				game.camera.rotation.x += window.rotVel
				window.sendCamRotX(game.camera.rotation.x)
			},50)
			cb(1)
		}
	}
}

window.switchCameraRotationZ = {
	camRotZInterval : null,
	direction : 0,
	switch : function(cb){
		if(this.camRotZInterval){
			if(this.direction){
				clearInterval(this.camRotZInterval)
				this.camRotZInterval = null
				this.direction = 0
				cb(0)
			} else {
				clearInterval(this.camRotZInterval)
				this.camRotZInterval = setInterval(function(){
					game.camera.rotation.z -= window.rotVel
					window.sendCamRotZ(game.camera.rotation.z)
				},50)
				this.direction = 1
				cb(-1)
			}
		} else {
			this.camRotZInterval = setInterval(function(){
				game.camera.rotation.z += window.rotVel
				window.sendCamRotZ(game.camera.rotation.z)
			},50)
			cb(1)
		}
	}
} 

window.switchCameraRotationY = {
	camRotYInterval : null,
	direction : 0,
	switch : function(cb){
		if(this.camRotYInterval){
			if(this.direction){
				clearInterval(this.camRotYInterval)
				this.camRotYInterval = null
				this.direction = 0
				cb(0)
			} else {
				clearInterval(this.camRotYInterval)
				this.camRotYInterval = setInterval(function(){
					game.camera.rotation.y -= window.rotVel
					window.sendCamRotY(game.camera.rotation.y)
				},50)
				this.direction = 1
				cb(-1)
			}
		} else {
			this.camRotYInterval = setInterval(function(){
				game.camera.rotation.y += window.rotVel
				window.sendCamRotY(game.camera.rotation.y)
			},50)
			cb(1)
		}
	}
}


window.moveX = {
	moveXInterval : null,
	direction : 0,
	switch : function(cb){
		if(this.moveXInterval){
			if(this.direction){
				clearInterval(this.moveXInterval)
				this.moveXInterval = null
				this.direction = 0
				cb(0)
			} else {
				clearInterval(this.moveXInterval)
				this.moveXInterval = setInterval(function(){
					game.camera.position.x -= window.mvVel
					window.sendPosX(game.camera.position.x)
				},50)
				this.direction = 1
				cb(-1)
			}
		} else {
			this.moveXInterval = setInterval(function(){
				game.camera.position.x += window.mvVel
				window.sendPosX(game.camera.position.x)
			},50)
			cb(1)
		}			
	},
	translate : function(dir) {
		game.camera.position.x  += window.translateVel*dir
		window.sendPosX(game.camera.position.x)
	}
}

window.moveY = {
	moveYInterval : null,
	direction : 0,
	switch : function(cb){
		if(this.moveYInterval){
			if(this.direction){
				clearInterval(this.moveYInterval)
				this.moveYInterval = null
				this.direction = 0
				cb(0)
			} else {
				clearInterval(this.moveYInterval)
				this.moveYInterval = setInterval(function(){
					game.camera.position.y -= window.mvVel
					window.sendPosY(game.camera.position.y)
				},50)
				this.direction = 1
				cb(-1)
			}
		} else {
			this.moveYInterval = setInterval(function(){
				game.camera.position.y += window.mvVel
				window.sendPosY(game.camera.position.y)
			},50)
			cb(1)
		}			
	},
	translate : function(dir) {
		game.camera.position.y += window.translateVel*dir
		window.sendPosY(game.camera.position.y)
	}
}
  

window.moveZ = {
	moveZInterval : null,
	direction : 0,
	switch : function(cb){
		if(this.moveZInterval){
			if(this.direction){
				clearInterval(this.moveZInterval)
				this.moveZInterval = null
				this.direction = 0
				cb(0)
			} else {
				clearInterval(this.moveZInterval)
				this.moveZInterval = setInterval(function(){
					game.camera.position.z -= window.mvVel
					window.sendPosZ(game.camera.position.z)
				},50)
				this.direction = 1
				cb(-1)
			}
		} else {
			this.moveZInterval = setInterval(function(){
				game.camera.position.z += window.mvVel
				window.sendPosZ(game.camera.position.z)
			},50)
			cb(1)
		}			
	},
	translate : function(dir) {
		game.camera.position.z += window.translateVel*dir
		window.sendPosZ(game.camera.position.z)
	}
}




Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;

}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


