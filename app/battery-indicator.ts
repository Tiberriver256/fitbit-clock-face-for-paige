import { battery } from "power";

export let BatteryIndicator = function(document) {  
  let self = this;
  
  let batContainerEl = document.getElementById("bat");
  let batEl = batContainerEl.getElementById("bat-count");
  let batFillEl = batContainerEl.getElementById("bat-fill");
  let batIcon = batContainerEl.getElementById("bat-icon");
  let batFillHeight = 14;
  
  self.draw = function() {
    let level = battery.chargeLevel;
    batEl.text = `${Math.floor(level)}%`;
    batFillEl.height = Math.floor(batFillHeight * level / 100.);
    batFillEl.y = batFillHeight - batFillEl.height;
  }
  
  self.setColor = function(color) {
    batFillEl.style.fill = color;
  }

}