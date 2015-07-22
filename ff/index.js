var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");


var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: self.data.url("popup.html"),
  contentScriptFile: [
  	self.data.url("js/lib/jqueryandangular.min.js"),
  	self.data.url("js/lib/ngDialog.min.js"),
  	self.data.url("js/lib/angular-strap.min.js"),
  	self.data.url("js/lib/angular-strap.tpl.min.js"),
  	self.data.url("js/app/app.js"),
  	self.data.url("js/app/popup.js"),
   ],
  /*

        <script src="js/lib/jqueryandangular.min.js"></script>
        <script src="js/lib/ngDialog.min.js"></script>
        <script src="js/lib/angular-strap.min.js"></script>
        <script src="js/lib/angular-strap.tpl.min.js"></script>
        
        <script src="js/app/app.js"></script>
        <script src="js/app/popup.js"></script>
  */
  onHide: handleHide
});

var tabs = require('sdk/tabs');
for (let tab of tabs)
  console.log(tab);

/**/
function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}