# handlebars-form-helper

A library of handlebars helpers that help with building forms.

* Tested only on Node 10.x (ES6), most likely only works with Handlebars 3.x
* Can be used Express 4.x and https://github.com/ericf/express-handlebars

## Installation

Install using npm:

```shell
$ npm install handlebars-form-helper
```

## Usage

### Registering the helpers

You have to register the helpers before you can use them in your templates.
The register method expects the Handlebars object to be passed in, and an *optional* config object, for example:

```javascript
HandlebarsFormHelper.register(Handlebars, {
  namespace: 'form',  // default namespace
});
```

Once the helpers are registered, you can use the helpers in your templates, and compile your templates as you usually
would.

### For use with Express and `express-handlebars`





### Using the helpers

Most of the helpers can be used inline, for example:

```
{{form-label 'name' 'Please enter your name'}}
```

For simplicity, all the helpers are written as expression helpers:

By default the helpers are registered without a default namespace of `form`.
If you need to change the helpers namespace, you can specify a custom namespace when
registering the helpers, for example:

```javascript
HandlebarsFormHelper.register(Handlebars, {
  namespace: 'myform',
});
```

Now the helpers are created with that namespace, for example:

```
{{myform-label 'name' 'Please enter your name'}}
```

### Form Helpers

Usage of each helper is in the form of `{{namespace-type ...}}`.  
The `type` corresponds as close as possible to `<input type="type" ...>`

```
{{form-open 'user' url class='form'}}
{{form-close}}
{{form-label 'name' 'Please enter your name'}}
{{form-text 'firstname' person.name}}
{{form-input 'firstname' person.name}}          // same as above
{{form-hidden 'secret' 'key123'}}
{{form-password 'password'}}
{{form-textarea 'text' 'Here is some text'}}
{{form-file 'fileupload'}}
{{form-email 'email'}}
{{form-date 'date'}}
{{form-number 'number'}}
{{form-checkbox 'apples' 'yes' true}}
{{form-radio 'apples' 'yes' true}}
{{form-select 'title' titles person.title}}
{{form-button 'save' 'Submit form'}}
{{form-submit 'save' 'Submit form'}}
```

All HTML elements will automatically have an `id` attribute which adds the
field type as a prefix to the name of the field

* `{{form-open 'user' ...}}` renders `<form id="form-user" name="user" ...>`
* `{{form-label 'name' ...}}` renders `<label id="label-"name" for="name" ...>`
* `{{form-button 'save' ...}}` renders `<input id="button-save" name="save" ...>`
* `{{form-submit 'save' ...}}` renders `<input id="submit-save" name="save" ...>`
* `{{form-image 'save' ...}}` renders `<input id="image-save" name="save" ...>`

All other types gets prefixed with `field-`

* `{{form-input 'firstname' ...}}` renders `<form id="field-firstName" name="firstName" ...>`

Additionally, checkboxes and radio buttons gets more unique `id` by suffixing the value

* `{{form-checkbox 'apples' 'yes' ...}}` yields `<form id="field-apples-yes" name="apples" ...>`
* `{{form-radio 'apples' 'yes' ...}}` yields `<form id="field-apples-yes" name="apples" ...>`

Besides the defined attributes above, you can pass additional HTML attributes at
the end of the helper and these will show up in the final HTML tag

```
{{form-text 'firstname' person.name
  style='background-color:red;'
  class='form-control required'
  data-id='1234'
}}
```

renders

```
<input
 type="text"
 id="field-firstName"
 name="firstName"
 style="background-color:red;"
 class="form-control required"
 data-id="1234" />
```

#### Examples:

**Form helper**
```html
{{form '' '/contact' class="form"}}{{/form}}
```
```html
<form method="POST" action="/contact" class="form"></form>
```



**Label helper**
```html
{{label "name" "Please enter your name"}}
```
```html
<label for="name">Please enter your name</label>
```
```html
{{#label}}Please enter your name{{/label}}
```
```html
<label>Please enter your name</label>
```

**Input helper**
```html
{{input "firstname" "Richard"}}
```
```html
<input type="text" id="firstname" name="firstname" value="Richard" />
```

**Button helper**
```html
{{button "save" "Submit form"}}
```
```html
<button name="save" type="button">Submit form</button>
```

**Submit button helper**
```html
{{submit "save" "Submit form"}}
```
```html
<button name="save" type="submit">Submit form</button>
```

**Select helper**
```html
{{select "title" titles title}}
```
```javascript
{
  titles: [{
    value: 'mr',
    text: 'Mr'
  }],
  title: 'mr'
}
```
```html
<select id="title" name="title"><option value="mr" selected="selected">Mr</option></select>
```

**Select (multiple) helper**
```html
{{select "title" titles selected}}
```
```javascript
{
  titles: [{
    value: 'mr',
    text: 'Mr'
  }],
  selected: ['mr']
}
```
```html
<select id="title" name="title" multiple="true"><option value="mr" selected="selected">Mr</option></select>
```

**Checkbox helper**
```html
{{checkbox "apples" "yes" true}}
```
```html
<input id="apples" name="apples" type="checkbox" value="yes" checked="true" />
```

**File helper**
```html
{{file "fileupload"}}
```
```html
<input name="fileupload" id="fileupload" type="file" />
```

**Hidden helper**
```html
{{hidden "secret" "key123"}}
```
```html
<input name="secret" id="secret" value="key123" type="hidden" />
```

**Password helper**
```html
{{password "password"}}
```
```html
<input name="password" id="password" type="password" />
```

**Textarea helper**
```html
{{textarea "text" "Here is some text"}}
```
```html
<textarea name="text" id="text">Here is some text</textarea>
```


### Form validation helpers

Validation helpers work in a similar way to the common form helpers, but handle displaying of validation errors and
field error styling.

The validation helpers expect an 'errors' object to be passed in, which is used to display the
validation errors for the field.

For example:

```javascript
var data = {
  errors: {
    name: [
      'Please enter a name'
    ]
  }
};
var source = '{{input_validation "name" "" errors}}' +
    '{{field_errors "name" errors class="help-block text-error"}}';
var template = Handlebars.compile(source);
var html = template(data);

// Compiled HTML will be:
// <input name="name" id="name" type="text" class="validation-error" />
// <span class="help-block text-error">Please enter a name</span>');
```

### Validation helpers

```
{{input_validation "firstname" person.name errors}}
{{label_validation "name" "Please enter your name" errors}}
{{select_validation "title" titles person.title errors}}
{{checkbox_validation "food[]" "apples" true errors}}
{{file_validation "fileupload" errors}}
{{password_validation "password" "dontdothis" errors}}
{{textarea_validation "text" "Here is some text" errors}}
```

### Error data

The errors object has to be in the following format:

```javascript
var errors = {
  fieldName: [
    'Error message 1',
    'Error message 2!'
  ]
};
```

#### Examples:

**Input validation helper**
```html
{{input_validation "name" "" errors}}
```
```html
<input name="name" id="name" type="text" class="validation-error" />
```

**Label validation helper**
```html
{{label_validation "name" "" errors}}
```
```html
<label for="name" class="validation-error">Enter your name</label>
```

**Select validation helper**
```html
{{select_validation "title" titles "" errors}}
```
```html
<select id="title" name="title" class="validation-error"><option value="mr">Mr</option></select>
```

**Checkbox validation helper**
```html
{{checkbox_validation "title" 1 false errors}}
```
```html
<input name="title" type="checkbox" value="1" id="title" class="validation-error" />
```

**File validation helper**
```html
{{file_validation "fileupload" errors}}
```
```html
<input name="fileupload" id="fileupload" type="file" class="validation-error" />
```

**Password validation helper**
```html
{{password_validation "password" "" errors}}
```
```html
<input name="password" id="password" type="password" class="validation-error" />
```

**Textarea validation helper**
```html
{{textarea_validation "text" "Here is some text" errors}}
```
```html
<textarea name="text" id="text" class="validation-error">Here is some text</textarea>
```

**Field errors helpers**

**Inline**
```
{{field_errors "text" errors class="error"}}
```
```html
<div class="error">Please enter some text</div>
```
**Block**
```
{{#field_errors "text" errors}}
<span class="help-block">{{this}}</span>
{{/field_errors}}
```
```html
<span class="help-block">Error message 1</span>
<span class="help-block">Error message 2</span>
```

## Demo

This demo shows how to use the helpers to build a form that handles validation:
http://badsyntax.github.io/handlebars-form-helpers/

## Contributing

Feel free to send pull requests.

### Running the tests

This project uses [jasmine](http://pivotal.github.io/jasmine/) for testing. If you want to run the tests, you'll need to have
[nodejs](http://nodejs.org/), [grunt-cli](https://github.com/gruntjs/grunt-cli) and [bower](http://bower.io/) installed.
You'll also need to install the project dependencies by
running `npm install && bower install` in the project root.

Once everything is installed, you can run the tests by either running `npm test` or `grunt test`.

## TODO

* Write some tests
* Implement `<optgroup></optgroup>` for `<select>`
* Implement `{{form-image 'save' 'Submit form'}}`
