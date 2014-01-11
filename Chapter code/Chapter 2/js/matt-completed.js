$(function(){
var win = $(window),
/* page will = both the html and body elements since browser reacts differently to each of these */

/* CODE DIFFERENCE - he references both the body and the html here in his code */
    page= $("body, html"),
/* start at the page level & find any div w/ a class of wrapper & set it's variable to 'wrapper' */
    wrapper = page.find("div.wrapper"),

/* start at the page level & find any article & set it's variable to 'wrapper' */
    article = page.find("article"),

/* start at the page level & find any aside & set it's variable to 'fixedEl'*/
    fixedEl = page.find("aside"),

/* start at the page level & find any section & set it's variable to 'sections'*/
    sections = page.find("section"),

/* create a var called initialPos and set it to fixedEl + offset()*/
    initialPos = fixedEl.offset(),

/* create a var called width & set it to the fixedEl & grab its width. width returns the top and left
 properties. this is grabbing the initial width of the wrapper element. */
    width = fixedEl.width(),

/* create a var called percentWidth & set it to 100 X width divided by the wrappers width(). this will
 store the width as a percentage rather than a fixed number. This will allow the var to react to the browser being resized. this also means that we can change the width value in the css and the jQuery will adjust. */
    percentWidth = 100 * width / wrapper.width();

/*  PAGE 54 - Handling the hash fragment */

/* If the page is requested with a hash fragment in it, the page will automatically jump to the
specified <section> when the page loads. In this part we'll add some code that checks the
hash property of the document location object and if a hash is detected, it will scroll to
the corresponding part of the page smoothly. */

/* In this bit of code, which will be executed as soon as the page has loaded, we first check
whether the document.location object contains a hash (or at least, contains a hash that
is not an empty string).

If it does, we obtain the hash, get the number of the <section>, and calculate the offset
from the top of the page in the same way that we have done in previous tasks. We then
set the scrollTop of the page to 0 to force the browser to the top of the page. We also
remove the hash at this point.

Finally we can call our scrollPage() function, passing in the new href fragment, the
amount of scroll required, and set the final argument to true so that the correct hash
fragment is added back to the browser's location bar. It should all happen so quickly that the
user does not notice that the page load has been intercepted and the behavior modified. */

if (document.location.hash){

    var href = document.location.hash,
        target = parseInt(href.split("#part")[1]),
        targetOffset = sections.eq(target - 1).offset().top;
        page.scrollTop(0);
        document.location.hash = "";
        scrollPage(href, targetOffset, true);
}


/* Our next task is to detect when the page has been scrolled and fix the element in place when
that occurs. Detecting the scroll event is made easy for us by jQuery, as is setting the position
to fixed, because there are simple jQuery methods we can call to do these exact things. */

/* We can use jQuery's one() method to attach an event handler to the window object that we
stored in a variable. The one() method will automatically unbind the event handler as soon
as the event is detected for the first time, which is useful because we only need to set the
element to position:fixed once. In this example we are looking for the scroll event. */

win.one("scroll", function(){
/* When the event is detected, the anonymous function we pass as the second argument
to one() will be executed. When this occurs we use jQuery's css() method to set some
style properties. We set the width of the element to counter situations where the width
of our target element increases because of float and/or margin on surrounding elements. */

/* We set the position to fixed and also set the top and left style properties using the
initial position of the element that we stored in the $$initialPos$$ variable at the start of
the project. We use JavaScript's Math.round() method in order to round the top and
left pixel positions to whole numbers, which helps to avoid any cross-browser issues with
subpixel rounding. */

    fixedEl.css({
        width: width,
        position: "fixed",
        top: Math.round(initialPos.top),
        left: Math.round(initialPos.left)
    });
});

/* To maintain the fixed element's correct location relative to the rest of the page, we should
add the following code directly after the one() method that we added in the last task: */


/* when the window resizes run this function ONCE - PAGE 49*/
win.on("resize", function(){

/* we only want to run this function if the aside element has already been set to 'fixed' via css */

/* Because our layout is liquid we also need to adjust the width of the fixed element. In the
CSS we originally set the width to 20%, so we can ensure that it stays at 20 percent of its
container by dividing the container's current width by 100 and then multiplying it by the
percentWidth variable we stored in the first task */
    if (fixedEl.css ("position") === "fixed") {
        var wrapperPos = wrapper.offset().left,
        wrapperWidth = wrapper.width(),
        fixedWidth = (wrapperWidth / 100) * percentWidth;

/* We then use jQuery's css() method to set the width of the fixed element and it's top
and left style properties to make sure that it stays in the correct location when the
window is resized.*/

    fixedEl.css({
        width: fixedWidth,
        left: wrapperPos + wrapperWidth - fixedWidth,
        top: article.offset().top
    });
    }
});

/* At this point, we should be able to click on any of the links in the navigation menu we added
to the fixed element, and the page will jump to bring the corresponding section into view.
The fixed element will still be fixed into place. */



/***** Begin Auto Scrolling -- PAGE 50 *****/
/***** explanation on PAGE 52 *****/

function scrollPage(href, scrollAmount, updateHash){
    if (page.scrollTop() !== scrollAmount){
        page.animate({
            scrollTop: scrollAmount
        }, 500, function(){
            if (updateHash){
                document.location.hash = href;
            }
        });
    }
}

/* The first argument is the event that we want to bind the handler to, which in this case is the
click event. The second argument is a selector; the on() method will filter all click events
so that only those originating from elements that match the selector will invoke the bound
handler function. */

page.on("click", "aside a", function(e){
  /* Here we're grabbing the natural event element behavior and telling it to stop doing what it normally does*/

  e.preventDefault();

/* Next, we set a variable that tells us which <section> the user would like to navigate to.
Inside our event handler function the $(this) object is scoped to the link that was clicked,
so we can easily get the required section id by getting the href attribute of the clicked link
using jQuery's attr() method. We store this in a variable called href. */

    var href = $(this).attr("href"),

/* We need to know where on the page the required <section> element is, which we obtain
by using JavaScript's split() method to split the string stored in the href variable that we
just set. */

/* If we specify #part as the string to split on, the split() method will return an array
consisting of two items, where the second item is a string version of the section number
that was clicked. By wrapping this statement in JavaScript's parseInt(), we end up with an
integer. We store this integer in the target variable. */

        target = parseInt (href.split("#part")[1]),

/* The last variable we set is the offset of the desired <section> element. To select the
correct <section> element, we can use the sections array that we stored at the start of
the project.

To pull the correct element from this array, we use jQuery's eq() method and pass it the
value that we just saved in the target variable minus 1. We need to subtract 1 because
arrays in JavaScript start at 0, but our <section> id attributes start at 1. */

        targetOffset = sections.eq(target - 1).offset().top;

/*
    FINALLY, CALL THE METHOD...

Once we have this information we can then call our scrollPage() function, passing in
the values we have just computed to animate the page scroll in order to bring the desired
<section> element into view. */

    scrollPage(href, targetOffset, true);
});

/*** Begin restoring the back button -- PAGE 50 ***/


/* PROBLEM: if the user tries to go back to a previous <section> using the back button of
his/her browser, nothing will happen.

SOLUTION: In this task we'll fix that so that the back button
works as expected, and can even use smooth scrolling when the back button is used to
go back to the previous <section>. */

/* We use jQuery's on() method to attach our event once again, and this time we don't need
to make use of event delegation, so we revert to the two-argument form of the method.
This time we are listening for the hashchange event, which as before is passed as the
first argument and occurs whenever the hash property of the document.location
object is changed.

In our handler function, which is passed as the second argument, we set the variables for the
different values that we need to pass to the scrollPage() function in order to perform the
scroll. We don't need to prevent the default behavior of the browser this time, and the href
variable is set using the document.location.hash property as it will be the back button
that will trigger the event, not one of the links in the <aside>.

Actually, this handler will also be triggered when one of the links is clicked, because the links
also update the hash, but the conditional check inside the scrollPage() function will
prevent unnecessary calls to jQuery's animate() method. */

win.on("hashchange", function(){
    var href = document.location.hash,
        target = parseInt (href.split("#part") [1]),


/* HIS EXPLINATION - The target variable is computed in exactly the same way as it was in the last event handler,
but this time, the targetOffset variable needs to handle cases where there is no hash
fragment in the address bar of the browser. To handle this, we use a JavaScript ternary
construct that checks whether the target variable that we just defined has a falsey value,
which would indicate an empty string. If it does, we want to just animate the scroll back to
zero. If it doesn't, we determine the required scroll amount in the same way as we did before. */

/* this is a ternary operator How it works:

Set a boolean condition before the question mark followed by it's result (in this case 0). If that statement is true, then run it. If it's falsey, run the code to the right of the ":"

(test) ? true doThis : false doThat

*/
    //   Is this true? If so, = 0           If it was false, run this
        targetOffset = (!href) ? 0    :    sections.eq(target - 1). offset().top;

    /*
    FINALLY, CALL THE METHOD...

Once we have this information we can then call our scrollPage() function, passing in
the values we have just computed to animate the page scroll in order to bring the desired
<section> element into view. */

    scrollPage(href, targetOffset, false);

});







}); /* closes out the outer function */