/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const tweetData = [{
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}, {
  "user": {
    "name": "Descartes",
    "avatars": "https://i.imgur.com/nlhLi3I.png",
    "handle": "@rd"
  },
  "content": {
    "text": "Je pense , donc je suis"
  },
  "created_at": 1461113959088
}];
// escape shit
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  //Memory leak prevent
  div.remove();
  return div.innerHTML;
}
$(document).ready(function() {
  //handle the counter
  var maxLimit = 140;
  $(document).ready(function() {
    $('#tweet-text').keyup(function() {
      $(this).css({
        height: '1px'
      });
      $(this).css({
        height: 25 + $(this)[0].scrollHeight + 'px'
      });
      var lengthCount = this.value.length;
      if (lengthCount > maxLimit) {
        // this.value = this.value.substring(0, maxLimit);
        var charactersLeft = maxLimit - lengthCount + 1;
        $('.counter').css('color', 'red');
      } else {
        var charactersLeft = maxLimit - lengthCount;
        $('.counter').css('color', 'inherit');
      }
      $('.counter').text(charactersLeft);
    });
  });
  //handle the tweet button
  $(".add-tweet-btn").click(function() {
    $("#tweet-text").focus();
    return false;
  });
  // handle  form submit
  $(".new-tweet form").on("submit", submitTweet);
  loadTweets();
  console.log("Ez Clap");
  renderTweets(tweetData);
});
const submitTweet = function(event) {
  event.preventDefault();
  const $form = $(this);
  const $input = $form.find('textarea');
  const formData = $form.serialize();
  // const formData = new FormData($form.get(0));
  // submit ajax request
  $.post({
    url: "/tweets?",
    data: formData
  }).done(function(data) {
    loadTweets(data);
  });
  return true;
};

function loadTweets(data) {
  if (data) {
    renderTweets(data);
    return;
  }
  // not expecting use of promises or for them to understand them at least.
  $.ajax('/tweets', {
    method: 'GET',
    dataType: "json"
  }).then(function(result) {
    renderTweets(result);
  });
}
const renderTweets = function(tweets) {
  const tweetsContainer = $('#tweets-container');
  // Empty the container first
  tweetsContainer.html('');
  tweets.forEach((tweet) => {
    const tweetElement = createTweetElement(tweet);
    tweetsContainer.prepend(tweetElement);
  });
};
const createTweetElement = function(tweetData) {
  const {
    user,
    content
  } = tweetData
  const {
    avatars,
    name,
    handle
  } = user
  const {
    text
  } = content
  // console.log("text", text, 'avatars, name, handle', avatars, name, handle);
  const html = `
	<article>
        <header>
          <div>
            <img src="${avatars}" alt="${escape(name)}">
            <h3>${escape(name)}</h3>
          </div>
          <div>
            <a class="hide" href="#">${handle}</a>
          </div>
        </header>
        <p>${escape(text)}</p>
        <hr>
        <footer>
          <div class="time">${timeSince(new Date(tweetData.created_at))} ago</div>
          <ul>
            <li><a href="#"><i class="fas fa-flag"></i></a></li>
            <li><a href="#"><i class="fas fa-retweet"></i></a></li>
            <li><a href="#"><i class="fas fa-heart"></i></a></li>
          </ul>
        </footer>
      </article>
	`;
  // const tweetElement = $tweet.append(html);
  return html;
};

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}