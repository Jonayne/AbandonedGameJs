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

  class Level1State {
    constructor(engine, game) {
      let self = this;
      this.ready = false;
      this.engine = engine;
      this.game = game;

      this.scene = new BABYLON.Scene(engine);

      this.meteSonidos();

      this.background_audio = new Audio("music/Lonelyhood.ogg");
      this.background_audio.volume = 0.2;
      this.background_audio.addEventListener("canplay", function() {
        this.play();
      });

      this.background_audio_rain = new Audio("music/Dark_Rainy_Night(ambience).ogg");
      this.background_audio_rain.loop = true;
      this.background_audio_rain.volume = 0.1;
      this.background_audio_rain.addEventListener("canplay", function() {
        this.play();
      });

      this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
      this.scene.collisionsEnabled = true;
      this.scene.clearColor = new BABYLON.Color3(0.46484375, 0.6171875, 0.79296875);

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "Lorian.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "key.babylon");
      this.assetsManager.addMeshTask("mesh_task", "", "modelos/", "level1.babylon");
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

      this.scene.ambientColor = new BABYLON.Color3(0.9, 0.3, 0.2);
      this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
      this.camera.radius = 130;
      this.camera.heightOffset = 90;
      this.camera.cameraAcceleration = 0.03;
      this.camera.maxCameraSpeed = 10;

      this.light = new BABYLON.DirectionalLight("directionalLight", 
                                                new BABYLON.Vector3(-1, -2, -1), 
                                                this.scene);
      this.light.position = new BABYLON.Vector3(0, 150, 20);
      this.light.diffuse = new BABYLON.Color3(0.2, 0, 1);
      this.light.specular = new BABYLON.Color3(1, 0.3, 1);

      //var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);

      let shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light);
      this.scene.activeCamera = this.camera;

      var GUITexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      // GUI
      this.take_text = new BABYLON.GUI.TextBlock();
      this.take_text.top = "20%";
      this.take_text.text = "E (2 veces) para recoger";
      this.take_text.color = "black";
      this.take_text.resizeToFit = true;
      this.take_text.fontSize = "5%";

      this.take_text.isVisible = false;

      this.actual_text = this.creaTexto("Uh... me duele mi cabeza... ¿Dónde estoy?\nEste lugar se ve extraño, no tengo de otra mas que explorar la zona...");
      hay_texto = true;

      this.num_yabes = 0;

      this.yabes = new BABYLON.GUI.TextBlock();
      this.yabes.top = "-45%";
      this.yabes.left = "-40%";
      this.yabes.text = "Llaves: " + this.num_yabes;
      this.yabes.color = "white";
      this.yabes.resizeToFit = true;
      this.yabes.fontSize = "5%";

      GUITexture.addControl(this.take_text);  
      GUITexture.addControl(this.actual_text); 
      GUITexture.addControl(this.yabes);
      
      this.character = new GameEngine.Character(this.scene);
      this.zombie2 = new GameEngine.Zombie(this.scene, this.character, -1637, 1.1, 1359);

      this.near_object = null;
      
      this.camera.lockedTarget = this.character.cameraTarget;
      

      //Level 1
      this.character.mesh.position.x = 1004.82;   
      this.character.mesh.position.z = -1090.28;

      this.key = new GameEngine.Object(this.scene, "AntiqueKey");
      this.key.mesh.position.x = -1356;
      this.key.mesh.position.y = 1.7
      this.key.mesh.position.z = -972;     

      this.level = new GameEngine.Object(this.scene, "Plane");
      this.level.mesh.position.x = -300;
      this.level.mesh.position.z = 200;  

      this.ball_2 = BABYLON.MeshBuilder.CreateSphere("Ball_2", {diameter: 200}, this.scene);
      this.ball_2.material = new BABYLON.StandardMaterial("BallMat_2", this.scene);
      this.ball_2.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_2.position.x = -1365.27;
      this.ball_2.position.y = 100;
      this.ball_2.position.z = 610.46;
      this.ball_2.checkCollisions = true;

      this.ball_3 = BABYLON.MeshBuilder.CreateSphere("Ball_3", {diameter: 200}, this.scene);
      this.ball_3.material = new BABYLON.StandardMaterial("BallMat_3", this.scene);
      this.ball_3.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_3.position.x = -71.31;
      this.ball_3.position.y = 100;
      this.ball_3.position.z = 687.83;
      this.ball_3.checkCollisions = true;

      this.ball_4 = BABYLON.MeshBuilder.CreateSphere("Ball_4", {diameter: 200}, this.scene);
      this.ball_4.material = new BABYLON.StandardMaterial("BallMat_4", this.scene);
      this.ball_4.emissiveColor = new BABYLON.Color3(0, 0, 1);
      this.ball_4.position.x = 1097.54;
      this.ball_4.position.y = 100;
      this.ball_4.position.z = 1649.61;      
      this.ball_4.checkCollisions = true;

      this.actual_text.fontSize = "3%";

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
          this.yabes.text = "Llaves: " + this.num_yabes;
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
      tex.fontSize = "4%";
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
            this.zombie_a3.play();
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
            this.ambiente_a3.play();
            if(!this.ball_4.isVisible && !this.ball_3.isVisible && !this.ball_2.isVisible){
              this.game.changeState("lvl2");
              this.background_audio.pause();
            }
          }
        }else{
          this.actual_text.text = "";
        }

        this.character.update(elapsed);
        this.zombie2.update(elapsed);

        if(this.key.active){
          if (this.key.mesh.intersectsMesh(this.character.mesh, false)) {
            this.near_object = this.key;
            this.take_text.isVisible = true;
          }else{
            this.near_object = null;
          }
        }

        if(this.num_yabes > 0){

          if (this.ball_2.isVisible && this.character.mesh.intersectsMesh(this.ball_2, false)) {
            this.ball_2.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.ball_2.checkCollisions = false;
            this.ball_2.isVisible = false;
            this.actual_text.text = "¿Qué es eso? ¿Qué es este lugar?\nTiene pinta de ser algún tipo de hospital,\npero no tengo memoria ahora mismo…\nEsto no me da buena espina…";
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
          }
          if (this.ball_3.isVisible && this.character.mesh.intersectsMesh(this.ball_3, false)) {
            this.ball_3.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_3.checkCollisions = false;
            this.ball_3.isVisible = false;
            this.actual_text.text = "- Lorian…\nese era mi nombre antes de entrar a esta locura de lugar";
            hay_texto = true;
            this.demon_a6.play();
            this.demon_a1.play();
            this.ambiente_a3.play();
          }
          if (this.ball_4.isVisible && this.character.mesh.intersectsMesh(this.ball_4, false)) {
            this.ball_4.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.ball_4.checkCollisions = false;
            this.ball_4.isVisible = false;
            this.actual_text.text = "Empiezo a recordar… este lugar es el hospital MerrieLand,\nrecuerdo haber escuchado al tío Johev hablar que este era un hospital psiquiátrico,\npero parece más bien un lugar de experimentación,\nla gente que está aquí no es normal, los ruidos… y parece no haber nadie…";
            hay_texto = true;
            this.demon_a7.play();
            this.demon_a5.play();
            this.ambiente_a1.play();
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

  GameEngine.Level1State = Level1State;
  return GameEngine;
})(GameEngine || {})