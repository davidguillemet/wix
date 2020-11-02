jQuery(document).ready( function($) {

	var $articleTitle = $('h2.TzArticleTitle');
	var mollusqueType = $.trim($articleTitle.text());
	var $wikiContent = $('#wikicontent');
	var wikiBaseUrl = "https://fr.wikipedia.org";
	var wikiApi = wikiBaseUrl + '/w/api.php?callback=?';
	/**
	 * Loads data from the API.
	 */

	function loadData() {
		$.ajax({
			url: wikiApi,
			dataType: 'json',
			data: {
				action: 'parse',
				prop: 'text',
				format: 'json',
				redirects: '',
				disableeditsection: '',
				disablepp: '',
				//mobileformat: '',
				//noimages:  '',
				//disabletoc: '',
				page: mollusqueType
			},
			success: onLoadData
		});
	};
  
    function missingArticle()
    {
		var errorMsg = '<p style="text-align: center; font-size: 24px;">';
		errorMsg += '<i class="icon-emo-displeased" style="font-size: 50px;  vertical-align: middle;"></i>&nbsp;&nbsp;';
		errorMsg += 'Oups...L\'article "' + mollusqueType + '" n\'existe pas sur Wikipedia...</p>';
		return errorMsg;
    }

	function onLoadData(response) {
		var $wikiHtml = "";
		var pageFound = true;
		if (response.error) {
			var spacePos = mollusqueType.indexOf(' ');
			if (spacePos != -1) {
				mollusqueType = mollusqueType.substr(0, spacePos);
				loadData();
				return;
			} else {
				$wikiHtml = $(missingArticle());
				pageFound = false;
			}
		} else {
			// Build Jquery HTML From wiki response
			// -> Emebed response in div container in order for jQuery.find to work as expected
			var content = "<div>" + response.parse.text['*'] + "</div>";
			$wikiHtml = $(content);
			
			// remove galleries...just display mine :)
			// --> The gallery itself
			$wikiHtml.find("ul.gallery").remove();
			// --> REmove the gallery title
			$wikiHtml.find("h2").each(function() {
				// Check if the current h2 contains a span children which id is 'Galerie'
				$(this).find("#Galerie").parent().remove(); // If yes, remove the h2 element...
			});
			// --> REmove the gallery message
			$wikiHtml.find("table.message-galerie").remove();
			
			// remove the image and legend from classification 
			var $legend = $wikiHtml.find(".images").next(".legend").remove(); // The legend paragraph
			$wikiHtml.find(".images").remove(); // The classification image
			

			// Modify links if they don't contain server information
			$wikiHtml.find("a").each(function() {
				var $link = $(this);
				var linkRef = $link.attr("href");
				if (linkRef && linkRef[0] != '#') // Don't modify anchors
				{
					// insert wiki server into href if missing
					if (linkRef && linkRef.indexOf("http") != 0 && linkRef.indexOf("//") != 0) {
						$link.attr("href", wikiBaseUrl + linkRef);
					}
					// Force target='_blank' for all links
					$link.attr("target", "_blank");
				}
			});
		}

		// Put the wiki content in the container
		$wikiContent.empty();
		$wikiContent.append($wikiHtml);
		
	    if (pageFound)
		{
			var $sourceLink = $("#sourceArticleLink");
			var sourceRef = $sourceLink.attr("href");
			$sourceLink.attr("href", sourceRef.replace("{0}", mollusqueType.replace(" ", "_")));
			$sourceLink.text(mollusqueType);
			$("#wikimessage").show();
		}
	}
	
    $articleTitle.css('text-transform', 'none');
	loadData();
	$(window).load(function() {
		$(".TzNavigationItem").css('text-transform', 'none');
	});
  
});
