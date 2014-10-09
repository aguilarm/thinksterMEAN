var potatoNews = angular.module('potatoNews', ['ui.router'])

potatoNews.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
//resolve ensures that any time home is entered, we always load all of the posts
//before the state finishes loading.  a blocking preload?
//more info at
//https://github.com/angular-ui/ui-router/wiki
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
          postPromise: ['posts', function (posts) {
              return posts.getAll();
          }]
      }
    })
    .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
            post: ['$stateParams', 'posts', function ($stateParams, posts) {
                return posts.get($stateParams.id);
            }]
        }
    });
  $urlRouterProvider.otherwise('home');
}])

potatoNews.factory('posts', ['$http', function ($http){
    var o = {
        posts: []
    };
    //query the '/posts' route and, with .success(),
    //bind a function for when that request returns
    //the posts route returns a list, so we just copy that into the
    //client side posts object
    //using angular.copy() makes ui update properly
    o.getAll = function() {
        return $http.get('/posts').success(function (data) {
            angular.copy(data, o.posts);
        });
    };
    //now we'll need to create new posts
    //uses the router.post in index.js to post a new Post mongoose model to mongodb
    //when $http gets a success back, it adds this post to the posts object in
    //this local factory, so the mongodb and angular data is the same
    //sweet!
    o.create = function(post) {
        return $http.post('/posts', post).success(function (data) {
            o.posts.push(data);
        });
    };
    //upvotes
    o.upvote = function (post) {
        //use the express route for this post's id to add an upvote to it in the mongo model
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function (data) {
                //if we know it worked on the backend, update frontend
                post.upvotes += 1;
            });
    };
    //grab a single post from the server
    o.get = function (id) {
        //use the express route to grab this post and return the response
        //from that route, which is a json of the post data
        //.then is a promise, a kind of newly native thing in JS that upon cursory research
        //looks friggin sweet; TODO Learn to use them like a boss.  First, this.
        return $http.get('/posts/' + id).then(function (res) {
            return res.data;
        });
    };
    //comments, once again using express
    o.addComment = function (id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };
    //upvotes
    o.upvoteComment = function (post, comment) {
        return $http.put('posts/' + post._id + '/comments/' + comment._id + '/upvote')
            .success(function (data) {
                comment.upvotes += 1;
            });
    };
    return o;
}])


potatoNews.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
    
    $scope.posts = posts.posts;
    //setting title to blank here to prevent empty posts
    $scope.title = '';
    
    $scope.addPost = function(){
        if($scope.title === '') {return;}
        posts.create({
            title: $scope.title,
            link: $scope.link,
        });
        //clear the values
        $scope.title = '';
        $scope.link = '';
    };
    
    $scope.incrementUpvotes = function(post) {
        //our post factory has an upvote() function in it
        //we're just calling this using the post we have
        posts.upvote(post);
    }

}])

potatoNews.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function ($scope, posts, post){
    //used to need $stateRouterProvider to figure out what
    //specific post we're grabbing.  Since we used the resolve object to
    //refer to the posts.get() function and assigned it to the post value
    //then injected that here, we now have the specific post from the db
    //we also inject 'posts' so we can screw with the comments
    $scope.post = post;
    
    console.log(post);
    console.log(posts);
    
    $scope.addComment = function () {
        if ($scope.body === '') { return; }
        posts.addComment(post._id, {
            body: $scope.body,
            author: 'user',
        }).success(function (comment) {
            $scope.post.comments.push(comment);
        });
        $scope.body = '';
    };
    
    $scope.incrementUpvotes = function (comment) {
        posts.upvoteComment (post, comment);
    };
    
}]);