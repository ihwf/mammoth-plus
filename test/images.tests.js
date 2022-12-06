var assert = require("assert");

var hamjest = require("hamjest");
var assertThat = hamjest.assertThat;
var contains = hamjest.contains;
var equalTo = hamjest.equalTo;
var hasProperties = hamjest.hasProperties;

var mammoth-plus = require("../");
var documents = require("../lib/documents");
var promises = require("../lib/promises");

var test = require("./test")(module);


test('mammoth-plus.images.inline() should be an alias of mammoth-plus.images.imgElement()', function() {
    assert.ok(mammoth-plus.images.inline === mammoth-plus.images.imgElement);
});


test('mammoth-plus.images.dataUri() encodes images in base64', function() {
    var imageBuffer = new Buffer("abc");
    var image = new documents.Image({
        readImage: function(encoding) {
            return promises.when(imageBuffer.toString(encoding));
        },
        contentType: "image/jpeg"
    });

    return mammoth-plus.images.dataUri(image).then(function(result) {
        assertThat(result, contains(
            hasProperties({tag: hasProperties({attributes: {"src": "data:image/jpeg;base64,YWJj"}})})
        ));
    });
});


test('mammoth-plus.images.imgElement()', {
    'when element does not have alt text then alt attribute is not set': function() {
        var imageBuffer = new Buffer("abc");
        var image = new documents.Image({
            readImage: function(encoding) {
                return promises.when(imageBuffer.toString(encoding));
            },
            contentType: "image/jpeg"
        });

        var result = mammoth-plus.images.imgElement(function(image) {
            return {src: "<src>"};
        })(image);

        return result.then(function(result) {
            assertThat(result, contains(
                hasProperties({
                    tag: hasProperties({
                        attributes: equalTo({src: "<src>"})
                    })
                })
            ));
        });
    },

    'when element has alt text then alt attribute is set': function() {
        var imageBuffer = new Buffer("abc");
        var image = new documents.Image({
            readImage: function(encoding) {
                return promises.when(imageBuffer.toString(encoding));
            },
            contentType: "image/jpeg",
            altText: "<alt>"
        });

        var result = mammoth-plus.images.imgElement(function(image) {
            return {src: "<src>"};
        })(image);

        return result.then(function(result) {
            assertThat(result, contains(
                hasProperties({
                    tag: hasProperties({
                        attributes: equalTo({alt: "<alt>", src: "<src>"})
                    })
                })
            ));
        });
    },

    'image alt text can be overridden by alt attribute returned from function': function() {
        var imageBuffer = new Buffer("abc");
        var image = new documents.Image({
            readImage: function(encoding) {
                return promises.when(imageBuffer.toString(encoding));
            },
            contentType: "image/jpeg",
            altText: "<alt>"
        });

        var result = mammoth-plus.images.imgElement(function(image) {
            return {alt: "<alt override>", src: "<src>"};
        })(image);

        return result.then(function(result) {
            assertThat(result, contains(
                hasProperties({
                    tag: hasProperties({
                        attributes: equalTo({alt: "<alt override>", src: "<src>"})
                    })
                })
            ));
        });
    }
});
