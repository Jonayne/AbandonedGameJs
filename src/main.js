window.addEventListener("load", function() {
  let theCanvas = document.getElementById("theCanvas");
  let engine = new BABYLON.Engine(theCanvas, true);

  let canvas_w = theCanvas.width;
  let canvas_h = theCanvas.height;

  let game = new GameEngine.Game(engine);

  engine.runRenderLoop(function() {
    game.processInput();
    game.update(engine.getDeltaTime()/1000);
    game.render();
  });

  
  let scale;
  window.addEventListener("resize", resize);
  function resize() {
    scale = Math.min( window.innerWidth/canvas_w, window.innerHeight/canvas_h );
    theCanvas.style.transform = "translate(" + ((window.innerWidth - scale*canvas_w)/2) + "px," + ((window.innerHeight - scale*canvas_h)/2) + "px) scale(" + scale + ")";
  }

  resize();
});