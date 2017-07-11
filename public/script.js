window.onload = function(){

	var converter = new showdown.Converter();
	var pad = document.getElementById('pad');
	var markdownArea = document.getElementById('markdown');

	  // make the tab act like a tab
    pad.addEventListener('keydown',function(e) {
        if(e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = e.target;
            var value = target.value;

            // set textarea value to: text before caret + tab + text after caret
            target.value = value.substring(0, start)
                            + "\t"
                            + value.substring(end);

            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            e.preventDefault();
        }
    });

	var previousMarkdownValue;

	var convertTextAreaToMarkdown = function(){

		var markdownText = pad.value;
		previousMarkdownValue = markdownText;
		html = converter.makeHtml(markdownText);
		markdownArea.innerHTML = html;
	};

	var didChangeOccur = function(){
		if(previousMarkdownValue != pad.value){
			return true;
		} 

		return false;
	}

	setInterval(function(){
		if(didChangeOccur()){
			convertTextAreaToMarkdown();
		}
	},1000);

	pad.addEventListener('input' , convertTextAreaToMarkdown);

	 // ignore if on home page
    if(document.location.pathname.length > 1){
        // implement share js
        var documentName = document.location.pathname.substring(1);
        sharejs.open(documentName, 'text', function(error, doc) {
            doc.attach_textarea(pad);
            convertTextAreaToMarkdown();
        });        
    }

    // convert on page load
    convertTextAreaToMarkdown();

};

//At the very bottom of this file, we open up a sharejs
// connection to "home" (because we are on the home page).
//e then attach the textarea to the object returned by 
//this connection. This code keeps our textarea in sync 
//with everyone else's textarea. So if Person A makes a
// change in their textarea, Person B will see that change 
// utomatically in their textarea. However, Person B's 
// markdown area will not be updated right away. In fact,
// Person B's markdown area won't be updated until they 
// make a change to their textarea themselves. This is a
// problem. We will solve this by making sure a change is
//  reflected every second if the textarea has changed.