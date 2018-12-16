var GameEngine = (function(GameEngine) {
  const PI_180 = Math.PI/180;
  const PI_270 = Math.PI/270;
  let keys = {};
  let t_textos = 20;
  let t_textos_aux = 0;
  let hay_texto = false;
  let t_accion = 1;
  let t_accion_aux = 0;
  let accion = false;

  class Level3State {
    constructor(engine, game) {
      let self = this;
      this.ready = false;
      this.engine = engine;
      this.game = game;
      this.scene = new BABYLON.Scene(engine);

      this.meteSonidos();

      this.llave_audio = new Audio("https://opengameart.org/sites/default/files/133008__cosmicd__annulet-of-absorption.wav");
      this.llave_audio.volume = 0.2;

      this.background_audio = new Audio("music/Sad_piano.mp3");
      this.background_audio.loop = true;
      this.background_audio.volume = 0.4;
      this.background_audio.addEventListener("canplay", function() {
        this.play();
      });

      this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
      this.scene.collisionsEnabled = true;

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Lorian.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "level3.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "zombie_sin_textura.babylon");

      this.assetsManager.onFinish = function () {
        self.init();
      }
      
      this.assetsManager.load();

    }

    init() {
      console.log("nani??")
      this.ready = true;
      BABYLON.Animation.AllowMatricesInterpolation = false;

      this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
      this.camera.radius = 130;
      this.camera.heightOffset = 90;
      this.camera.cameraAcceleration = 0.03
      this.camera.maxCameraSpeed = 10;

      this.light = new BABYLON.DirectionalLight("directionalLight", 
                                                new BABYLON.Vector3(-1, -2, -1), 
                                                this.scene);
      this.light.position = new BABYLON.Vector3(0, 150, 20);
      this.light.diffuse = new BABYLON.Color3(1, 0, 0);
      this.light.specular = new BABYLON.Color3(0, 1, 0);

      let shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light);
      this.scene.activeCamera = this.camera;

      // GUI
      this.take_text = new BABYLON.GUI.TextBlock();
      this.take_text.top = "20%";
      this.take_text.text = "E(2 veces) para recoger";
      this.take_text.color = "black";
      this.take_text.resizeToFit = true;
      this.take_text.fontSize = "5%";

      this.take_text.isVisible = false;

      this.actual_text = this.creaTexto("");
      hay_texto = false;

      this.yabes = new BABYLON.GUI.TextBlock();
      this.yabes.top = "-45%";
      this.yabes.left = "-40%";
      this.yabes.text = "Llaves:";
      this.yabes.color = "white";
      this.yabes.resizeToFit = true;
      this.yabes.fontSize = "5%";

      this.num_yabes = 0;

      this.n_yabes = new BABYLON.GUI.TextBlock();
      this.n_yabes.top = "-45%";
      this.n_yabes.left = "-30%";
      this.n_yabes.text = this.num_yabes.toString();
      this.n_yabes.color = "white";
      this.n_yabes.resizeToFit = true;
      this.n_yabes.fontSize = "5%";

      var GUITexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      GUITexture.addControl(this.take_text);  
      GUITexture.addControl(this.actual_text); 
      GUITexture.addControl(this.yabes); 
      GUITexture.addControl(this.n_yabes);
      
      this.character = new GameEngine.Character(this.scene);
      this.near_object = null;

      this.zombie = new GameEngine.Zombie(this.scene, this.character, 65, 1, -822);

      shadowGenerator.getShadowMap().renderList.push(this.character.mesh);
      shadowGenerator.getShadowMap().renderList.push(this.character.mesh2);
      
      this.camera.lockedTarget = this.character.cameraTarget;

      //Level 3
      this.character.mesh.position.x = -217.71;
      this.character.mesh.position.z = 1439.30;

      this.key6 = new GameEngine.Object(this.scene, "AntiqueKey");
      this.key6.mesh.position.x = -217.71;
      this.key6.mesh.position.z = 733.18;

      this.level = new GameEngine.Object(this.scene, "Plane");
      this.level.mesh.position.x = -300;
      this.level.mesh.position.z = 200;  

      this.ball_8 = BABYLON.MeshBuilder.CreateSphere("Ball_8", {diameter: 200}, this.scene);
      this.ball_8.material = new BABYLON.StandardMaterial("BallMat_8", this.scene);
      this.ball_8.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_8.position.x = -212.18;
      this.ball_8.position.y = 100;
      this.ball_8.position.z = 496.15;       
      this.ball_8.checkCollisions = true;

      this.ball_9 = BABYLON.MeshBuilder.CreateSphere("Ball_9", {diameter: 300}, this.scene);
      this.ball_9.material = new BABYLON.StandardMaterial("BallMat_9", this.scene);
      this.ball_9.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_9.position.x = 734.46;
      this.ball_9.position.y = 100;
      this.ball_9.position.z = 1128.44;
      this.ball_9.checkCollisions = true;
    
      this.ball_10 = BABYLON.MeshBuilder.CreateSphere("Ball_10", {diameter: 200}, this.scene);
      this.ball_10.material = new BABYLON.StandardMaterial("BallMat_10", this.scene);
      this.ball_10.emissiveColor = new BABYLON.Color3(1, 0, 0);
      this.ball_10.position.x = -829.73;
      this.ball_10.position.y = 100;
      this.ball_10.position.z = 1473.02;
      this.ball_10.checkCollisions = true;

      // register keyboard input
      this.scene.actionManager = new BABYLON.ActionManager(this.scene);
      this.scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, 
          function(evt) {
            keys[evt.sourceEvent.key] = true;
          }
        )
      );
      this.scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, 
          function(evt) {
            delete keys[evt.sourceEvent.key];
          }
        )
      );

    }

    meteSonidos(){

      this.llave_audio = new Audio("https://opengameart.org/sites/default/files/133008__cosmicd__annulet-of-absorption.wav");
      this.llave_audio.volume = 0.2;

      this.ambiente_a1 = new Audio("music/dark_ambiences/ambience-1.wav");
      this.ambiente_a2 = new Audio("music/dark_ambiences/ambience-2.wav");
      this.ambiente_a3 = new Audio("music/dark_ambiences/ambience-5.wav");

      this.demon_a1 = new Audio("music/demons/Demon_00.mp3");
      this.demon_a2 = new Audio("music/demons/Demon_08.mp3");
      this.demon_a3 = new Audio("music/demons/Demon_14.mp3");
      this.demon_a4 = new Audio("music/demons/Demon_20.mp3");
      this.demon_a5 = new Audio("music/demons/Human_DyingBreath_03.mp3");
      this.demon_a6 = new Audio("music/demons/qubodup-GhostMoan03.mp3");
      this.demon_a7 = new Audio("music/demons/qubodup-GhostMoan04.mp3");

      this.zombie_a1 = new Audio("music/zombies/zombie-18.wav");
      this.zombie_a2 = new Audio("music/zombies/zombie-4.wav");
      this.zombie_a3 = new Audio("music/zombies/zombie-8.wav");

    }

    processInput() {
      if (this.ready) {
        this.character.processInput(keys);

        if ((keys["E"] || keys["e"]) && this.near_object && this.near_object.active && !accion){
          this.near_object.mesh.isVisible = false;
          this.near_object.mesh.checkCollisions = false;
          this.near_object.active = false;
          this.num_yabes += 1;
          this.n_yabes.text = "";   
          this.n_yabes.text = this.num_yabes.toString();
          accion = true;
          this.llave_audio.play();
        }

        // Para saber donde poner las cosas.
        if(keys["d"]){
          console.log("X:");
          console.log(this.character.mesh.position.x);
          console.log("Y:");
          console.log(this.character.mesh.position.y);
          console.log("Z:");
          console.log(this.character.mesh.position.z);
        }

      }
    }

    creaTexto(txt){
      var tex = new BABYLON.GUI.TextBlock();
      tex.top = "10%";
      tex.text = txt;
      tex.color = "white";
      tex.resizeToFit = true;
      tex.fontSize = "3%";
      tex.isVisible = false;

      return tex;
    }

    update(elapsed) {
      if (this.ready) {
        
        if(accion){
          t_accion_aux += elapsed;
          if(t_accion_aux >= t_accion){
            t_accion_aux = 0;
            accion = false;
          }
        }

        this.take_text.isVisible = false; 
        this.actual_text.isVisible = false;

        if(hay_texto){
          this.actual_text.isVisible = true;
          t_textos_aux += elapsed;
          if(t_textos_aux >= t_textos){
            this.actual_text.isVisible = false;
            hay_texto = false;
            t_textos_aux = 0;
          }
        }else{
          this.actual_text.text = "";
        }

        this.character.update(elapsed);
        this.zombie.update(elapsed);

        if(this.num_yabes > 0){
          if (this.ball_8.isVisible && this.character.mesh.intersectsMesh(this.ball_8, false)) {
            this.ball_8.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_8.checkCollisions = false;
            this.ball_8.isVisible = false;
            this.actual_text.text = "Entonces era como sospechaba, desde el principio he estado solo,\nsólo me usaron para ganarse algo de sucio dinero a cambio de mi vida,\ntal vez no sabían que esto pasaría pero… ya no hay mucho que hacer.";
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a6.play();
          }
          if (this.ball_9.isVisible && this.character.mesh.intersectsMesh(this.ball_9, false)) {
            this.ball_9.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_9.checkCollisions = false;
            this.ball_9.isVisible = false;
            this.actual_text.text = "Muchas veces tomamos decisiones y no miramos atrás, aunque algo muy importante esté en juego.\nMi vida a estas alturas ya no tiene sentido,\neste lugar es un infierno y no sé qué sacaron con hacerme esto,\npero no les daré el placer de jugar más.";
            hay_texto = true;
            this.demon_a6.play();
            this.demon_a1.play();
            this.ambiente_a3.play();
          }
          if (this.ball_10.isVisible && this.character.mesh.intersectsMesh(this.ball_10, false)) {
            this.ball_10.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_10.checkCollisions = false;
            this.ball_10.isVisible = false;
            this.actual_text.text = "Bye.";
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a1.play();
            this.demon_a6.play();
            this.demon_a4.play();
            this.ambiente_a1.play();
            this.ambiente_a3.play();
            this.demon_a1.play();
            this.demon_a5.play();
            this.character.state = "Dead";
            this.demon_a5.loop = true;
            this.background_audio.pause();
          }
        }
        
        if(this.key6.active){
          if (this.key6.mesh.intersectsMesh(this.character.mesh, false)) {
            this.near_object = this.key6;
            this.take_text.isVisible = true;
          }else{
            this.near_object = null;
          }
        }
      }
    }

    render() {
      if (this.ready) {
        this.scene.render();
      }
    }

  }

  GameEngine.Level3State = Level3State;
  return GameEngine;
})(GameEngine || {})