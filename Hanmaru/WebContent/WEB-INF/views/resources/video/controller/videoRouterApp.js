var appVideo = angular.module('videoApp', ['ngRoute'])
 .config(function ($routeProvider) {
  $routeProvider
    .when('/main', {templateUrl: 'main.html',controller:''}) //메인
    .when('/news', {templateUrl: '../video/news/news_list.html',controller:''}) //뉴스H (한라로, 현장소식, 업계동향)
    
    .when('/story', {templateUrl: '../video/story/culture.html',controller:''}) //스토리H (조직문화, 비즈니스, 트렌드)
    .when('/knowledge', {templateUrl: '../video/knowledge/knowledge.html',controller:''}) //지식H (지식공유, 직무역량, 아카데미)
    .when('/empathy ', {templateUrl: '../video/empathy/event.html',controller:''}) //공감H (이벤트, 마켓)
//    .when('/videoNews', {templateUrl: 'news_list.html',controller:''}) //추가메뉴
    
    .when('/introduce', {templateUrl: '../video/common/introduce.html',controller:''}) //한라튜브 소개 (
    .when('/channel', {templateUrl: '../video/common/contents_list.html',controller:''}) //콘텐츠 편성표
    .when('/suggest', {templateUrl: '../video/common/suggestion_list.html',controller:''}) //콘텐츠 제안
    .otherwise({redirectTo: '/main'});
});

