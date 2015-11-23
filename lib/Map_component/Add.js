'use strict';

let add = (map, data, file) => {
  L.geoJson(data, {
    onEachFeature(feature, layer) {
      let html = ""; 

      if(file.title == undefined && file.content == undefined) {
        for(let key in feature.properties) {
          html += "<font class='content'>" + key + "： " + feature.properties[key] + "</font><br/>";
        }   
        layer.bindPopup(html);
      }
      else {
        for(let key in file.title) {
          html += "<font class='header'>" + file.title[key] + (file.title[key] == "" ? "" : "： ") + feature.properties[key] + "</font><br/>"
        }
        for(let key in file.content) {
          html += "<font class='content'>" + file.content[key] + (file.content[key] == "" ? "" : "： ") + feature.properties[key] + "</font><br/>"
        }
        layer.bindPopup(html);
      }
    },  
    pointToLayer(feature, point) {
      if(file.point == undefined) {
        return L.marker(point);
      }
      else {
        let icon = file.point(feature.properties, point);
        if(icon != undefined) { 
          return icon;
        }
        else {
          return L.marker(point);
        }
      }
    },
    filter: function(feature, layer) {
      if(file.filter != undefined) {
        return file.filter(feature.properties);
      }
      else {
        return true;
      }
    }
  }).addTo(map);
}

module.exports = (map, path, files) => {
  for(let i in files) {
    let fileName = Object.keys(files[i])[0];
    let file = files[i][fileName];
    if(path == undefined) {
      add(map, file.data, file);
    }
    else {
      let fileName = Object.keys(files[i])[0];
      let url = path.replace('[name]', fileName);
      let file = files[i][fileName];

      $.getJSON(url, (data) => {
        add(map, data, file);
      });
    }
  }
}