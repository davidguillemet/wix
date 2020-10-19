const exifr = require('exifr')

function getObjectProperty(object, propertyName, defaultValue) {
	if (object !== null && object !== undefined) {
		const propertyValue = object[propertyName]
		if (propertyValue !== undefined) {
			return propertyValue
		}
	}
	return defaultValue
}

//exifr.orientation('./DSC_2370-Modifier.jpg').then(orientation => console.log("orientation = " + orientation))

//  { xmp: true, tiff: false, ifd0: false, gps: false, exif: false }
exifr.parse('./DSC_2370-Modifier.jpg',
			{ 
				
				//icc: true,
				iptc: false,
				//jfif: true,
				xmp: true,
				tiff: true,
				exif: false,
				//image: true,
				interop: false,
				ifd0: true,
				//ifd1: true,
				//gps: false,
				makerNote: false,
  			  	userComment: false,
				//pick: ["ImageWidth", "description", "subject"]
			})
  .then(output => { 
	  console.log({
	 	title: getObjectProperty(output.title, "value", ""),
	  	description: getObjectProperty(output.description, "value", ""),
		tags: getObjectProperty(output, "subject", null),
		width : getObjectProperty(output, "ImageWidth", null),
	  })
	  console.log(output)
    }
  ).catch(e => {
  	console.log(e.message)
  })
