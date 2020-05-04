let mongoose = require("mongoose")
let Campground = require("./models/campground")
let Comment = require("./models/comment")
let data = [
    {name: "Cloud Rest",
    image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",   
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet iste atque a, nobis ullam corrupti vero aliquid quos tenetur dolorum, temporibus neque sequi nostrum debitis. Voluptas eius quod cumque porro."
    },
    {name: "Yeetground",
    image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80",   
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet iste atque a, nobis ullam corrupti vero aliquid quos tenetur dolorum, temporibus neque sequi nostrum debitis. Voluptas eius quod cumque porro."
    },
    {name: "Larjun",
    image: "https://images.unsplash.com/photo-1527931548997-178c464df936?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",   
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet iste atque a, nobis ullam corrupti vero aliquid quos tenetur dolorum, temporibus neque sequi nostrum debitis. Voluptas eius quod cumque porro."
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {  
        if (err) {
            console.log(err);
        }
        console.log("removed campground");
            //add a few campgrounds
        data.forEach(function (seed) {  
            Campground.create(seed, function (err, campground) {  
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a campground");
                    //Create a comment
                    Comment.create({
                        text: "this place is great, but i wish there was internet",
                        author: "Homer"
                    }, function (err, comment) {  
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment)
                            campground.save()
                            console.log("Created new comment");
                        }
                    })
                }
            })
        })
        })
}

module.exports = seedDB