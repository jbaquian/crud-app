// Initialize Parse app
Parse.initialize('4ikbB89WCtVhEDuN3WkeSEFw0wK0Ev4dvlNXUJ26', 'NqB05EyJlnddmqCEudtxw5L8Wp5D4G75hVlwX2Tw');

// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');
$.fn.raty.defaults.path = 'raty/lib/images'
var yeses = 0
var total = 0
var average = 0
var avgRating = $('#avgRat').raty({
	readOnly: true
})
$('#userRat').raty();
var list = $('#list');
// Click event when form is submitted
$('form').submit(function() {

	// Create a new instance of your Review class 
	var review = new Review();
	review.set('rating', $('#userRat').raty('score'))
	// For each input element, set a property of your new instance equal to the input's value
	
	$(this).find('input').each(function(){
		review.set($(this).attr('id'), $(this).val());
		$(this).val('');
	})

	// After setting each property, save your new instance back to your database
	review.save(null, {
		success:getData
	})
	return false
})



// Write a function to get data
var getData = function() {
	

	// Set up a new query for our Music class
	var query = new Parse.Query(Review)

	// Set a parameter for your query -- where the website property isn't missing
	query.notEqualTo('reviewTitle', '')

	/* Execute the query using ".find".  When successful:
	    - Pass the returned data into your buildList function
	*/
	query.find({
		success:function(results) {
			buildList(results)
		} 
	})
}

// A function to build your list
var buildList = function(data) {
	$('ul').empty();
	list.empty();

	// Loop through your data, and pass each element to the addItem function
	data.forEach(function(d){
		addReview(d);
	})
}


// This function takes in an item, adds it to the screen
var addReview = function(item) {
	// Get parameters (website, title, review) from the data item passed to the function
	var title = item.get('reviewTitle')
	var review = item.get('review')
	//var yeses = 0
	//var total = 0
	// Append li that includes text from the data item
	var li = $('<li><div id = "revew" class = "container"><h3>' + title + '</h3><br/><p>' + review + '</p></div></li>')
	var yes =$('<button class = "btn btn-default btn-sm">Yes</button>')
	var no = $('<button class="btn btn-default btn-sm">No</button>')
	var yesNo = $('<p>Was this review helpful?</p>'+ yes+no)
	// Create a button with a <span> element (using bootstrap class to show the X)
	var button = $('<button class="btn-danger btn-xs"><span>Remove</span></button>')
	var helpful = $('<p>' + item.get('yeses') +' out of '+ item.get('total') + ' people think this review is helpful(Note:Your vote will not immediately show up, but is recorded to help others)</p>')
	// Click function on the button to destroy the item, then re-call getData
	button.click(function() {
		item.destroy({
			success:getData
		})
	})
	// var rating =d.get('rating')
	// stars.raty({
	// 	readOnly: true,
	// 	score: rating
	// })
	// var reviewNum = list.children().length;
	// average = (average+ Number(rating))/length
	// avgRating.raty({
	// 	score: average,
	// 	readOnly: true
	// })

	// Append the button to the li, then the li to the ol
	li.append(yesNo)
	li.append(yes.click(function(){
		item.increment('yeses')
		item.increment('total')
		item.save()
	}))
	li.append(no.click(function(){
		item.increment('total')
		item.save()
	}))
	li.append(button);
	li.append(helpful)

	li.appendTo(list)	
}

// Call your getData function when the page loads
getData()
