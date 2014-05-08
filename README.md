socket-header
---
> Experiment in loading page assets over a socket instead of statically declared in the head.

why?
---
I was just ruminating on how to keep HTTP requests low for page assets. This popped in my head. I tested it out.

is it a good idea?
---
I have no idea. Probably not. Just collecting data and testing things out. I am not compressing anything sent over the socket. Perhaps sending binary data will be better?

how?
---
I use [socket.io](http://socket.io/) to spin up a socket server. The server that it runs on has previously loaded all the assets for the page and hold their data in memory. When a client connects (ie, when the web page loads and the socket is connected to in a script in the header), it sends down the asset map. The client then dynamically inserts the _data_ - __important to note that it does not dynamically inject script and style tags__. It actually injects the scripts using `eval()` and assigns the text content of a &lt;style&gt; tag.

Within the _/client_ directory, there are two index files:

* index.html - implements the socket solution.
* index2.html - how you would normally declare page assets.

I chose some of the bigger client-side libraries I know of to push through some heavier bytes: [jQuery](jquery.com) and [bootstrap](http://getbootstrap.com/).

results
---
I used [webpagetest](http://www.webpagetest.org/) just to get a quick waterfall. The results are as follows:

* index.html (socket) : http://www.webpagetest.org/result/140508_23_YPQ/1/details/
* index2.html (normal) : http://www.webpagetest.org/result/140508_XZ_YPW/1/details/

Still parsing the data to gain insight into if this solution is even viable of a complete crock :)

cons
---
There are several cons i can think of using a socket to load page assets:

* will likely need to chunk on N-number of assets
* currently no order of scripts being eval'ed()
* eval'ing()
* currently no order of dynamically adding styles
* socket support (ie, fallback is just HTTP polling anyway)
* Flash Of Unstyled Content (FOUC)
