var GameEngine = (function(GameEngine) {
  const PI_180 = Math.PI/180;
  const PI_2 =  Math.PI/2;
  let move_vector;

  class Zombie {
    constructor(scene, character, x=0, y=5, z=-5) {

      this.scene = scene;

      this.character = character;

      //Obteniendo todos los meshes
      //this.mesh = scene.getMeshByName("cabeza");
      //this.mesh2 = scene.getMeshByName("cabello");
      //this.mesh3 = scene.getMeshByName("ropa");
      //this.mesh4 = scene.getMeshByName("cuerpo");
      //this.mesh5 = scene.getMeshByName("dientes");
      //this.mesh6 = scene.getMeshByName("ojos");
      //this.mesh7 = scene.getMeshByName("forma_ojos");
      //this.mesh8 = scene.getMeshByName("reflejo_ojos");

      this.mesh = scene.getMeshByName("zombie_joins");
      this.mesh2 = scene.getMeshByName("zombie_surface");

      //Sincronizando los meshes
      this.mesh2.parent = this.mesh;
      //this.mesh3.parent = this.mesh;
      //this.mesh4.parent = this.mesh;
      //this.mesh5.parent = this.mesh;
      //this.mesh6.parent = this.mesh;
      //this.mesh7.parent = this.mesh;
      //this.mesh8.parent = this.mesh;

      //Revisar colisiones
      this.mesh.checkCollisions = true;

      //Checando elipsoides
      this.mesh.ellipsoid = new BABYLON.Vector3(35, 90, 50);
      this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 90, 0);

      //let debug_ellipsoid = BABYLON.MeshBuilder.CreateSphere("tmp_sphere", {diameterX: 35, diameterY: 180, diameterZ: 50});
      //debug_ellipsoid.position.y = 90;
      //debug_ellipsoid.parent = this.mesh;
      //debug_ellipsoid.visibility = 0.25;

      //Cargando los huesitos.
      this.skeleton = scene.getSkeletonByName("Zombie_armadura");

      //Animacion de caminar
      this.walk_range = this.skeleton.getAnimationRange("zombie_walk");

      //Empieza animacion de caminar
      scene.beginAnimation(this.skeleton, this.walk_range.from, this.walk_range.to, true, 0.7);

      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.mesh.position.z = z;

      this.state = "Idle";

    }


    update(elapsed) {

        if(BABYLON.Vector3.Distance(this.mesh.position, this.character.mesh.position) < 350){
          
          //move_vector = BABYLON.Vector3.Lerp(this.mesh.position-20, this.character.mesh.position, 0.007).subtract(this.mesh.position);
          move_vector = new BABYLON.Vector3(1, 0, 1);

          this.mesh.moveWithCollisions(move_vector);

          this.mesh.lookAt(this.character.mesh.position);
        }

    }
  }
  GameEngine.Zombie = Zombie;
  return GameEngine;
})(GameEngine || {})
