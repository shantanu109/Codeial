{   
    //method to Submit the form data for New Post using AJAX

    let createPost = function(){

        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                //Converts the form data into JSON, Content would be the key and Value would be value filled in form

                data: newPostForm.serialize(),
                success: function(data){

                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    //Method to create a Post in DOM

    //Function to convert this text of HTML into HTML Text / JQuery Object

    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">

                    <p>
                        
                
                        <small>
                            <a class='delete-post-button' href="/posts/destroy/${post._id}">X</a>
                        </small>
                
                        
                        ${post.content}
                
                        <br>
                
                        <small>
                            ${ post.user.name}
                        </small>
                        
                
                    </p>
                
                    <div class="post-comments">
                
                
                            <form action="/comments/create" method="POST">
                
                                <input type="text" name="content" placeholder="Type Here to add Comment" required>
                                <input type="hidden" name="post" value="${post._id}">
                                <input type="submit" value="Add Comment">
                
                            </form>
                            
                        
                
                        <div class="post-comments-list">
                            <ul id='post-comments-${ post._id}'>
                                
                            </ul>
                        </div>
                
                    </div>
                
                
                </li>`)
    }

    //Method to delete a Post from DOM

    let deletePost = function(deleteLink){

        $(deleteLink).click(function(e){

            e.preventDefault();

            $.ajax({

                type: 'get',

                //This is how you get the value of href in <a> tag
                url: $(deleteLink).prop('href'),
                success: function(data){

                    $(`#post-${data.data.post_id}`).remove();

                },error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }


    createPost();

}