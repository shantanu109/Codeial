{let n=function(){let n=$("#new-post-form");n.submit((function(o){o.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:n.serialize(),success:function(n){let o=t(n.data.post);$("#posts-list-container>ul").prepend(o),e($(" .delete-post-button",o)),new ToggleLike($(" .toggle-like-button",o)),new Noty({theme:"relax",text:"Post published",type:"success",layout:"topRight",timeout:1500}).show()},error:function(n){console.log(n.responseText)}})}))},t=function(n){return $(`<li id="post-${n._id}">\n\n                    <p>\n                        \n                \n                        <small>\n                            <a class='delete-post-button' href="/posts/destroy/${n._id}">X</a>\n                        </small>\n                \n                        \n                        ${n.content}\n                \n                        <br>\n                \n                        <small>\n                            ${n.user.name}\n                        </small>\n\n                        <br>\n\n                        <small>\n\n                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${n._id}&type=Post">\n                                0 Likes\n                            </a>\n\n                        </small>\n                        \n                \n                    </p>\n                \n                    <div class="post-comments">\n                \n                \n                            <form action="/comments/create" method="POST">\n                \n                                <input type="text" name="content" placeholder="Type Here to add Comment" required>\n                                <input type="hidden" name="post" value="${n._id}">\n                                <input type="submit" value="Add Comment">\n                \n                            </form>\n                            \n                        \n                \n                        <div class="post-comments-list">\n                            <ul id='post-comments-${n._id}'>\n                                \n                            </ul>\n                        </div>\n                \n                    </div>\n                \n                \n                </li>`)},e=function(n){$(n).click((function(t){t.preventDefault(),$.ajax({type:"get",url:$(n).prop("href"),success:function(n){$("#post-"+n.data.post_id).remove()},error:function(n){console.log(n.responseText)}})}))};n()}