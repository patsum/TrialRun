angular.module('AngularBlog.controllers', [])

    .controller('HomeController', ['$scope', '$location', 'Post', function ($scope, $location, Post) {
        $scope.posts = Post.query();

        $scope.goToCompose = function () {
            $location.path('/compose');
        }
    }])

    .controller('ComposeController', ['SEOService', '$scope', '$location', 'Post', 'Category', 'User', function (SEOService, $scope, $location, Post, Category, User) {
        SEOService.setSEO({
            title: 'Contact Us',
            image: 'http://' + $location.host() + '/images/contact-us-graphic.png',
            url: $location.url(),
            description: 'A description of this page'
        });

        $scope.categories = Category.query();
        $scope.users = User.query();

        $scope.savePost = function () {
            var post = new Post({
                title: $scope.title,
                userid: $scope.userid,
                categoryid: $scope.categoryid,
                content: $scope.content
            });
            post.$save(function (success) {
                $location.path('/');
            })
        }
    }])

    .controller('UpdateController', ['$scope', '$location', '$routeParams', 'Post', 'Category', 'User',
        function ($scope, $location, $routeParams, Post, Category, User) {
            $scope.categories = Category.query();
            Post.get({ id: $routeParams.id }, function (success) {
                $scope.post = success;
            });

            $scope.updatePost = function () {
                $scope.post.$update(function (success) {
                    $location.path('/' + $routeParams.id);
                });
            }
        }])


    .controller('SingleController', ['$scope', '$location', '$routeParams', 'Post',
        function ($scope, $location, $routeParams, Post) {
            Post.get({ id: $routeParams.id }, function (success) {
                $scope.post = success;
            });

            $scope.goToUpdate = function () {
                $location.path($location.path() + "/update");
            }

            $scope.deletePost = function () {
                if (confirm("Are you sure you want to delete this post?")) {
                    $scope.post.$delete(function () {
                        $location.path('/');
                    })
                }
            }
        }])

    .controller('LoginController', ['$scope', '$location', 'UserService',
        function ($scope, $location, UserService) {
            UserService.me().then(function (success) {
                redirect();
            });
            function redirect() {
                var dest = $location.search().p;
                if (!dest) { dest = '/'; }
                $location.path(dest).search('p', null);
            }

            $scope.login = function () {
                UserService.login($scope.email, $scope.password).then(function () {
                    redirect();
                }, function (err) {
                    console.log(err);
                })
            }
        }])

    .controller('UserListController', ['$scope', 'User', 'UserService',
        function ($scope, User, UserService) {
            UserService.requireLogin();
            $scope.users = User.query();

            $scope.createUser = function(){
                new User({
                    firstname: $scope.firstname,
                    lastname: $scope.lastname,
                    email: $scope.email,
                    password: $scope.password
                })
            }

            $scope.deleteUser = function (id) {
                User.get({ id: id }, function (success) {
                    success.$delete(function () {
                        $scope.users = User.query();
                    })
                })
            }
        }])
    .controller('DonationController', ['$scope', '$http', function ($scope, $http) {
        $scope.processPayment = function () {
            Stripe.card.createToken({
                number: $scope.cardNumber,
                cvc: $scope.cvc,
                exp_month: $scope.expMonth,
                exp_year: $scope.expYear
            }, function (status, response) {
                if (response.error) {
                    alert('problem!');
                } else {
                    var token = response.id; // send this to server
                    $http({
                        method: "POST",
                        url:"http://localhost:3000/api/donations",
                        data:{
                            token:token,
                            amount: 600
                        }
                    }).then(function(){
                        alert("PAYMENT SUCCESSFUL!");
                    }, function(){
                        alert("PAYMENT FAILED.");
                    })
                }
            });
        }
    }])