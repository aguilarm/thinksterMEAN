var potatoNews = angular.module('potatoNews', ['ui.router'])

potatoNews.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
    });
  $urlRouterProvider.otherwise('home');
}])

potatoNews.factory('posts', function (){
    var o = {
        posts:[]
    };
    return o;
})


potatoNews.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
    
    $scope.posts = posts;
    console.log(posts.posts);
    console.log($scope.posts);
    //setting title to blank here to prevent empty posts
    $scope.title = '';
    
    $scope.posts = [
        {title: 'post 1', upvotes: 5},
        {title: 'post 2', upvotes: 2},
        {title: 'post 3', upvotes: 15},
        {title: 'post 4', upvotes: 9},
        {title: 'post 5', upvotes: 4}
    ];
    
    console.log(posts.posts);
    console.log($scope.posts);
    
    $scope.addPost = function(){
        if($scope.title === '') {return;}
        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            upvotes: 0,
            comments: [
                {author: 'Joe', body: 'Great taste! Potato!', upvotes: 901},
                {author: 'Bob', body: 'This is seriously potatoes?', upvotes: 0}
            ]
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