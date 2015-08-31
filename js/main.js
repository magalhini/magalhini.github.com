(function(win) {
    function Blog() {}

    Blog.prototype.initialize = function() {
        var headerNav = new HeaderNavigation('#header-nav').start();
        var scrollTop = new ScrollTop().start('c-scrollTop');
    };

    console.log('Hi!');

    var blog = new Blog();

    blog.initialize();
}(window));
