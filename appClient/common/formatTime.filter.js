(function () {

  angular
    .module('blogsiteApp')
    .filter('formatTime', formatTime);

  function formatTime () {
    return function(time){
      var thisTime=new Date().valueOf();
      time=new Date(time).valueOf();
      //console.log(time.valueOf());console.log(thisTime);
      if (time && thisTime<time+60*1000) {
      	return '1 min ago';
      }else if (time && thisTime<time+60*10*1000){
      	return 'in 10m';
      }else if (time && thisTime<time+60*30*1000){
      	return 'in half hour';
      }else if (time && thisTime<time+60*60*1000){
      	return '1 hour ago';
      }else if (time && thisTime<time+60*60*12*1000){
      	return 'half day ago';
      }else if (time && thisTime<time+60*60*24*1000){
      	return '1 day ago';
      }else if (time && thisTime<time+60*60*24*2*1000){
      	return '2 day ago';
      }else if (time && thisTime<time+60*60*24*3*1000){
      	return '3 day ago';
      }else if (time){
      	return new Date(time).toLocaleDateString();
      }
    };
  }

})();