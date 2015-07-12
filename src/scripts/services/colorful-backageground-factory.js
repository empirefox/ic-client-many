'use strict';

angular.module('app.service.color-bg', []).factory('ColorfulGenerator', function() {

  // The Generator
  var generator = new ColorfulBackgroundGenerator();

  // This adds 5 layers to the generator
  // The parameters are: degree[0-360],
  //                      hue[0-360], saturation[0-100], lightness[0-100],
  //                      positionColor[0-100], positionTransparency[0-100]
  // The lowest layer (at the bottom) in the css is the first added layer.
  generator.addLayer(new ColorfulBackgroundLayer(325, 5, 95, 55, 100)); // bottom layer
  generator.addLayer(new ColorfulBackgroundLayer(245, 75, 90, 70, 30, 80));
  generator.addLayer(new ColorfulBackgroundLayer(155, 150, 95, 70, 10, 80));
  generator.addLayer(new ColorfulBackgroundLayer(55, 230, 95, 65, 0, 70));
  generator.addLayer(new ColorfulBackgroundLayer(20, 300, 90, 65, 0, 55)); // top layer

  function randomBackgroundColor(element) {
    for (var i = generator.getNumberOfLayers() - 1; i >= 0; i--) {
      var layer = generator.getLayerByIndex(i);
      layer.hue = Math.ceil(359 * Math.random());
      layer.saturation = Math.ceil(10 * Math.random()) + 90;
      layer.lightness = Math.ceil(10 * Math.random()) + 40;
    }
    generator.assignStyleToElement(element);
  }

  return {
    random: randomBackgroundColor,
  };
});
