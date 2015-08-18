(function() {
  var Helpers, fs, hbs, path, templateData;

  fs = require('fs');

  path = require('path');

  hbs = new Object();

  templateData = new Object();

  Helpers = (function() {
    function Helpers(handlebars, tplateData) {
      hbs = handlebars;
      templateData = tplateData;
      return {
        template: this.template,
        capitals: this.capitals,
        link: this.link,
        cssInject: this.cssInject,
        jsInject: this.jsInject
      };
    }

    Helpers.prototype.capitals = function(str) {
      return str.toUpperCase();
    };

    Helpers.prototype.jsInject = function(mode) {
      var content, i, len, script, scripts;
      content = new String();
      scripts = fs.readdirSync('./src/js');
      if (mode !== 'live') {
        content += "<!-- bower:js -->\n\t<!-- endbower -->\n";
      }
      for (i = 0, len = scripts.length; i < len; i++) {
        script = scripts[i];
        if (path.extname(script) === '.js') {
          if (mode === 'live') {
            content += "<script src=http://" + templateData.year + ".igem.org/Template:" + templateData.teamName + "/js/" + script + "?action=raw&type=text/js></script>";
          } else {
            if (script !== 'vendor.min.js') {
              content += "<script src=\"js/" + script + "\"></script>";
            }
          }
        }
      }
      return new hbs.SafeString(content);
    };

    Helpers.prototype.cssInject = function(mode) {
      var content, i, len, styles, stylesheet;
      content = new String();
      styles = fs.readdirSync('./src/styles');
      if (mode !== 'live') {
        content += "<!-- bower:css -->\n\t<!-- endbower -->\n\t";
      }
      for (i = 0, len = styles.length; i < len; i++) {
        stylesheet = styles[i];
        if (path.extname(stylesheet) === '.css') {
          if (mode === 'live') {
            content += "<link rel=\"stylesheet\" href=\"http://" + templateData.year + ".igem.org/Template:" + templateData.teamName + "/css/" + stylesheet + "?action=raw&ctype=text/css\" type=\"text/css\" />\n\t";
          } else {
            if (stylesheet !== 'vendor.min.css') {
              content += "<link rel=\"stylesheet\" href=\"styles/" + stylesheet + "\" type=\"text/css\" />\n\t";
            }
          }
        }
      }
      return new hbs.SafeString(content);
    };

    Helpers.prototype.link = function(linkName, mode) {
      if (linkName === 'index') {
        return "index.html";
      }
      if (mode === 'live') {
        return linkName;
      } else {
        return linkName + ".html";
      }
    };

    Helpers.prototype.template = function(templateName, mode) {
      var template;
      template = hbs.compile(fs.readFileSync(__dirname + "/src/templates/" + templateName + ".hbs", 'utf8'));
      if (mode === 'live') {
        if (templateName === 'preamble') {
          return new hbs.SafeString('');
        }
        return new hbs.SafeString("{{" + templateData.teamName + "/" + templateName + "}}");
      } else {
        return new hbs.SafeString(template(templateData));
      }
    };

    return Helpers;

  })();

  module.exports = Helpers;

}).call(this);
