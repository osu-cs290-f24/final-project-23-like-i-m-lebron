(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['navBarTemplate'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<nav class=\"navbar\">\n    <ul class=\"navlist\">\n        <li class=\"navitem\"><a href=\"/\">Home</a></li>\n        <li class=\"navitem\"><a href=\"/queue\">My Queue</a></li>\n        <li class=\"navitem\"><a href=\"/reviews\">My Reviews</a></li>\n        <li class=\"navitem\"><a href=\"/popular\">Most Popular</a></li>\n        <li class=\"navitem right\"><button type=\"button\" id=\"add-album-button\">Add Album</button></li>\n    </ul>\n</nav>";
},"useData":true});
})();