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

  class Level2State {
    constructor(engine, game) {
      let self = this;

      this.ready = false;
      this.engine = engine;
      this.game = game;
      this.scene = new BABYLON.Scene(engine);

      this.llave_audio = new Audio("https://opengameart.org/sites/default/files/133008__cosmicd__annulet-of-absorption.wav");
      this.llave_audio.volume = 0.2;

      this.meteSonidos();

      this.background_audio = new Audio("https://opengameart.org/sites/default/files/Socapex%20-%20Dark%20ambiance_3.mp3");
      this.background_audio.loop = false;
      this.background_audio.volume = 0.2;
      this.background_audio.addEventListener("canplay", function() {
        this.play();
      });

      this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
      this.scene.collisionsEnabled = true;
      this.scene.clearColor = new BABYLON.Color3(0.46484375, 0.6171875, 0.79296875);

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Lorian.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "level2.babylon");
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

      this.scene.ambientColor = new BABYLON.Color3(0.75, 0.75, 0.75);
      this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
      this.camera.radius = 130;
      this.camera.heightOffset = 90;
      this.camera.cameraAcceleration = 0.03;
      this.camera.maxCameraSpeed = 10;

      this.light = new BABYLON.DirectionalLight("directionalLight", 
                                                new BABYLON.Vector3(-1, -2, -1), 
                                                this.scene);
      this.light.position = new BABYLON.Vector3(0, 150, 20);
      this.light.diffuse = new BABYLON.Color3(0.2, 0.7, 0.6);
      this.light.specular = new BABYLON.Color3(0.65, 0.3, 0.3);

      let shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light);
      this.scene.activeCamera = this.camera;

      // GUI
      this.take_text = new BABYLON.GUI.TextBlock();
      this.take_text.top = "20%";
      this.take_text.text = "E (2 veces) para recoger";
      this.take_text.color = "black";
      this.take_text.resizeToFit = true;
      this.take_text.fontSize = "5%";

      this.take_text.isVisible = false;

      this.actual_text = this.creaTexto("Sí… ha pasado más de 1 hora desde que me levanté y los efectos\nde esta amnesia están dvesvaneciendose poco a poco.");
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

      shadowGenerator.getShadowMap().renderList.push(this.character.mesh);
      shadowGenerator.getShadowMap().renderList.push(this.character.mesh2);
      
      this.camera.lockedTarget = this.character.cameraTarget;

      //Level 2
      this.character.mesh.position.x = -1132.89;
      this.character.mesh.position.z = 828.22;

      this.zombie = new GameEngine.Zombie(this.scene, this.character, -710, 1, 625);

      this.key4 = new GameEngine.Object(this.scene, "AntiqueKey");
      this.key4.mesh.position.x = -408.83;
      this.key4.mesh.position.z = 801.74;

      this.level = new GameEngine.Object(this.scene, "Plane");
      this.level.mesh.position.x = -300;
      this.level.mesh.position.z = 200;  

      this.ball_5 = BABYLON.MeshBuilder.CreateSphere("Ball_5", {diameter: 200}, this.scene);
      this.ball_5.material = new BABYLON.StandardMaterial("BallMat_5", this.scene);
      this.ball_5.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_5.position.x = 425.99;
      this.ball_5.position.y = 100;
      this.ball_5.position.z = 446.39;	
      this.ball_5.checkCollisions = true;

      this.ball_6 = BABYLON.MeshBuilder.CreateSphere("Ball_6", {diameter: 200}, this.scene);
      this.ball_6.material = new BABYLON.StandardMaterial("BallMat_6", this.scene);
      this.ball_6.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_6.position.x = 66.33;
      this.ball_6.position.y = 100;
      this.ball_6.position.z = 66.33;
      this.ball_6.checkCollisions = true;   

      this.ball_7 = BABYLON.MeshBuilder.CreateSphere("Ball_7", {diameter: 200}, this.scene);
      this.ball_7.material = new BABYLON.StandardMaterial("BallMat_7", this.scene);
      this.ball_7.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_7.position.x = 822.99;
      this.ball_7.position.y = 100;
      this.ball_7.position.z = -817.35;
      this.ball_7.checkCollisions = true;

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
            if(!this.ball_7.isVisible && !this.ball_6.isVisible && !this.ball_5.isVisible){
              	this.game.changeState("lvl3");
              	this.background_audio.pause();
            }
          }
        }else{
          this.actual_text.text = "";
        }

        this.character.update(elapsed);
        this.zombie.update(elapsed);

        if(this.num_yabes > 0){
          if (this.ball_5.isVisible && this.character.mesh.intersectsMesh(this.ball_5, false)) {
            this.ball_5.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_5.checkCollisions = false;
            this.ball_5.isVisible = false;
            this.actual_text.text = "Maldita sea mi suerte, estoy harto de este lugar.\nDemasiadas criaturas, pero parece no pueden hacerme nada, ¿qué soy?";
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a6.play();
          }
          if (this.ball_6.isVisible && this.character.mesh.intersectsMesh(this.ball_6, false)) {
            this.ball_6.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_6.checkCollisions = false;
            this.ball_6.isVisible = false;
            this.actual_text.text = "Antes de llegar a este lugar tuve un conflicto en mi hogar,\nsiempre he tenido problemas, por eso me habían mencionado sobre MerrieLand…\nque incluso ofrecían pagos a las familias por “cuidar” a sus familiares…";
            hay_texto = true;
            this.demon_a6.play();
            this.demon_a1.play();
            this.ambiente_a3.play();
          }
          if (this.ball_7.isVisible && this.character.mesh.intersectsMesh(this.ball_7, false)) {
            this.ball_7.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_7.checkCollisions = false;
            this.ball_7.isVisible = false;
            this.actual_text.text = "Eso significa que… ¿mi familia me ha vendido? No…";
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
            this.demon_a1.play();
            this.demon_a6.play();
            this.demon_a4.play();
            this.ambiente_a1.play();
            this.ambiente_a3.play();
          }
        }

        if(this.key4.active){
          if (this.key4.mesh.intersectsMesh(this.character.mesh, false)) {
            this.near_object = this.key4;
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

  GameEngine.Level2State = Level2State;
  return GameEngine;
})(GameEngine || {})