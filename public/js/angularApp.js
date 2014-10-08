var potatoNews = angular.module('potatoNews', ['ui.router'])

potatoNews.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
//resolve ensures that any time home is entered, we always load all of the posts
//before the state finishes loading.
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
          postPromise: ['posts', function (posts) {
              console.log('postPromise');
              console.log(posts.getAll());
              return posts.getAll();
          }]
      }
    })
    .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
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
    o.create = function(post) {
        return $http.post('/posts', post).success(function (data) {
            o.posts.push(data);
        });
    };
    
    return o;
}])


potatoNews.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
    
    $scope.posts = posts.posts;
    console.log(posts.posts);
    console.log($scope.posts);
    //setting title to blank here to prevent empty posts
    $scope.title = '';
    
    console.log(posts.posts);
    console.log($scope.posts);
    
    $scope.addPost = function(){
        if($scope.title === '') {return;}
        posts.create({
            title: $scope.title,
            link: $scope.link,
        });
        //clear the values
        $scope.title = '';
        $scope.link = '';
        
        console.log(posts.posts);
        console.log($scope.posts);
    };
    
    $scope.incrementUpvotes = function(post) {
        post.upvotes += 1;
    }

}])

potatoNews.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function ($scope, $stateParams, posts){
    console.log(posts.posts);
    $scope.post = posts.posts[$stateParams.id];
}]);