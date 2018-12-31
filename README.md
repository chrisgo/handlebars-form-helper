# handlebars-form-helper

A library of handlebars helpers that help with building forms.

* Tested only on Node 10.x (ES6), most likely only works with Handlebars 3.x/4.x
* Can be used with Express 4.x and https://github.com/ericf/express-handlebars

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

In server.js

```javascript
const express = require('express');
const exphbs = require('express-handlebars');
const hbsFormHelper = require('handlebars-form-helper');
...
const app = express();
const hbs = exphbs.create({
  defaultLayout: 'app',
  extname: '.hbs',
  layoutsDir: `${__dirname}/app/views/layouts/`,
  partialsDir: `${__dirname}/app/views/partials/`,
});
// Call the registerHelper and pass in the handlebars object
hbsFormHelper.registerHelpers(hbs.handlebars, { namespace: 'form' });
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
...
app.listen(...);
```

### Using the helpers

Most of the helpers can be used inline, for example:

```handlebars
{{form-label 'name' 'Please enter your name'}}
```

For simplicity, all the helpers are written as *expression* helpers.

By default the helpers are registered without a default namespace of `form`.
If you need to change the helpers namespace, you can specify a custom namespace when
registering the helpers, for example:

```javascript
HandlebarsFormHelper.register(Handlebars, {
  namespace: 'myform',
});
```

Now the helpers are created with that namespace, for example:

```handlebars
{{myform-label 'name' 'Please enter your name'}}
```

### Form Helpers

Usage of each helper is in the form of `{{namespace-type ...}}`.  
The `type` corresponds as close as possible to `<input type="type" ...>`

```handlebars
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

#### Automatic `id` attribute

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

```handlebars
{{form-text 'firstname' person.name
  style='background-color:red;'
  class='form-control required'
  data-id='1234'
}}
```

renders

```html
<input type="text" id="field-firstName" name="firstName" value="person.name"
 style="background-color:red;"
 class="form-control required"
 data-id="1234" />
```

If you do not want this behavior, just add an `id=false` (uses id=name)
OR `id=someotherid` to additional HTML attributes to override it

```handlebars
{{form-text 'firstname' person.name id=false}}
```

renders

```html
<input type="text" id="firstName" name="firstName" value="person.name" />
```

```handlebars
{{form-text 'firstname' person.name id='someotherid'}}
```

renders

```html
<input type="text" id="someotherid" name="firstName" value="person.name" />
```

### Examples

#### Form Helper

```handlebars
{{form-open 'user' '/user' class='form'}}
```
```html
<!-- Note there is no closing </form> tag, use {{form-close}} for that -->
<form id="form-user" name="user" method="POST" action="/user" class="form">
```

```handlebars
{{form-close}}
```
```html
</form>
```

#### Label Helper

```handlebars
{{label 'name' 'Please enter your name'}}
```
```html
<label id="label-name" for="name">Please enter your name</label>
```

#### Input Helper

```handlebars
{{form-text 'firstname' person.name}}
{{form-input 'firstname' person.name}}  // same as above
{{form-hidden 'secret' 'key123'}}
{{form-password 'password'}}
{{form-textarea 'text' 'Here is some text'}}
{{form-file 'fileupload'}}
{{form-email 'email'}}
{{form-date 'date'}}
{{form-number 'number'}}
{{form-checkbox 'apples' 'yes' true}}
{{form-radio 'apples' 'yes'}}
```
```html
<input type="text" id="field-firstname" name="firstName" value="person.name" />
<input type="text" id="field-firstname" name="firstName" value="person.name" />
<input type="hidden" id="field-secret" name="secret" value="key123" />
<input type="password" id="field-password" name="password" />
<textarea id="field-text" name="text">Here is some text</textarea>
<input type="file" id="field-file" name="file" />
<input type="email" id="field-email" name="email" value="" />
<input type="date" id="field-date" name="date" value="" />
<input type="number" id="field-number" name="number" value="" />
<input type="checkbox" id="field-apples-yes" name="apples" value="yes" selected="selected" />
<input type="radio" id="field-apples-yes" name="apples" value="yes" />
```

#### Select Helper

```handlebars
{{!-- titles = { 'Mr': 'Mister', 'Ms': 'Miss', 'Dr': 'Doctor' }; --}}
{{form-select 'title' titles 'Ms'}}
```
```html
<select id="field-title" name="title">
  <option value="Mr">Mister</option>
  <option value="Ms" selected="selected">Miss</option>
  <option value="Dr">Doctor</option>
</select>
```

You can also pass an array on the `selected` attribute for multiple selected items

#### Button Helper

```handlebars
{{form-button "save" "Submit form"}}
{{form-submit 'save' 'Submit form'}}
```
```html
<input type="button" id="button-save" name="save">Submit form</button>
<input type="submit" id="submit-save" name="save">Submit form</button>
```

## Contributing

Feel free to send pull requests.

## References

* https://github.com/badsyntax/handlebars-form-helpers/blob/master/src/handlebars.form-helpers.js
* https://laravelcollective.com/docs/5.4/html
* https://docs.koseven.ga/guide-api/Form

## TODO

* Write some tests
* Figure out how to pass `config` object into each helper for better flexibility (for example, where we prefix the `id` attribute or not)
* Implement `<optgroup></optgroup>` for `<select>`
* Implement `{{form-image 'save' 'Submit form'}}`
