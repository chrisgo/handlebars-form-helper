// handlebars-form-helper.js
//
// References:
// https://github.com/badsyntax/handlebars-form-helpers/blob/master/src/handlebars.form-helpers.js
// https://laravelcollective.com/docs/5.4/html
// https://docs.koseven.ga/guide-api/Form
//
// TODO: All the methods here as static which means we cannot pass configuration
// for each method.  Ideally, we would want to pass a config object into
// each method so we can do some if statements inside each static method

const Handlebars = require('handlebars');

/**
 * Form helper
 */
class HandlebarsFormHelper {
  /**
   * Form open
   * {{form-open name url class="form"}}
   *
   * @param {string} name - name of form
   * @param {string} url - url for form
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static open(name, url, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('form', false, Object.assign({
      name,
      id: `form-${name}`,
      action: url,
      method: 'POST',
    }, attributes ? attributes.hash : {})));
  }

  /**
   * Form close
   * {{form-close}}
   * @return {string} html
   */
  static close() {
    return new Handlebars.SafeString(HandlebarsFormHelper.closeTag('form'));
  }

  // ==================== LABEL ====================

  /**
   * Label
   * {{form-label "name" "Please enter your name"}}
   * Not supported: {{#label}}Anything here{{/label}}
   *
   * @param {string} input - name of input field
   * @param {string} body - label to display
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static label(input, body, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('label', true, Object.assign({
      id: `label-${input}`,
      for: input,
    }, attributes ? attributes.hash : {}), body));
  }

  // ==================== FIELDS ====================

  /**
   * CSRF token hidden field
   * {{form-token "secret"}}
   * @param {string} name - name of token field
   * @param {string} token - CSRF token field
   * @return {string} html
   */
  static token(name = '_token', token) {
    return new Handlebars.SafeString(`<input type="hidden" name="${name}" value="${token}"/>`);
  }

  /**
   * Hidden field
   * {{form-hidden "secret" "key123"}}
   * @param {string} name - name of form
   * @param {string} value - url for form
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static hidden(name, value, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
      name,
      value,
      type: 'hidden',
    }, attributes ? attributes.hash : {})));
  }

  /**
   * Password
   * {{form-password "password" "dontdothis"}}
   * @param {string} name - name of field
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static password(name, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
      name,
      type: 'password',
    }, attributes ? attributes.hash : {})));
  }

  /**
   * Text input field
   * {{form-text "firstname" person.name}}
   * @param {string} name - name of form
   * @param {string} value - url for form
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static text(name, value, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
      name,
      value,
      type: 'text',
    }, attributes ? attributes.hash : {})));
  }

  /**
   * Convenience function for most of the text fields
   * {{form-input "firstname" person.name}}
   * @param {string} name - name of field
   * @param {string} value - value
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static input(name, value, attributes) {
    return HandlebarsFormHelper.text(name, value, attributes);
  }

  /**
   * Textarea
   * {{form-textarea "text" "Here is some text"}}
   * @param {string} name - name of field
   * @param {string} body - body
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static textarea(name, body, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('textarea', true, Object.assign({
      name,
    }, attributes ? attributes.hash : {}), body));
  }

  // ==================== FILE ====================

  /**
   * File field
   * {{form-file "fileupload"}}
   * @param {string} name - name of field
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static file(name, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
      name,
      type: 'file',
    }, attributes ? attributes.hash : {})));
  }

  // ==================== SPECIAL FIELDS ====================

  /**
   * Email field
    * {{form-email "email" ''}}
   * @param {string} name - name of field
   * @param {string} value - value
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static email(name, value, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
      name,
      value,
      type: 'email',
    }, attributes ? attributes.hash : {})));
  }

  /**
   * Date field
    * {{form-date "date" ''}}
   * @param {string} name - name of field
   * @param {string} value - value
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static date(name, value, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
      name,
      value,
      type: 'date',
    }, attributes ? attributes.hash : {})));
  }

  /**
   * Number field
    * {{form-number "number" ''}}
   * @param {string} name - name of field
   * @param {string} value - value
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static number(name, value, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
      name,
      value,
      type: 'number',
    }, attributes ? attributes.hash : {})));
  }

  // ==================== OPTIONS ====================

  /**
   * Checkbox
   * {{form-checkbox "food[]" "apples" true}}
   * @param {string} name - name of field
   * @param {string} value - value of radio button
   * @param {string} checked - if radio button is checked
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static checkbox(name, value, checked, attributes) {
    const localAttributes = {
      name,
      value,
      type: 'checkbox',
    };
    if (checked === true || checked === value) {
      localAttributes.checked = 'checked';
    }
    // Don't add an id attribute if the name uses the multiple character sequence, eg: 'food[]'
    // if (!/\[\]/.test(name)) {
    //   localAttributes.id = name;
    // }
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
    }, localAttributes, attributes ? attributes.hash : {})));
  }

  /**
   * Radio
   * {{form-radio "likes_cats" "1" true}}
   *
   * TODO: Possibly add the value to the id attribute of the HTML tag
   * to make each id unique
   *
   * @param {string} name - name of field
   * @param {string} value - value of radio button
   * @param {string} checked - if radio button is checked
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static radio(name, value, checked, attributes) {
    const localAttributes = {
      name,
      value,
      id: `field-${name}-${value}`,
      type: 'radio',
    };
    if (checked === true || checked === value) {
      localAttributes.checked = 'checked';
    }
    // Don't add an id attribute if the name uses the multiple character sequence, eg: 'food[]'
    if (/\[\]/.test(name)) {
      localAttributes.id = false;
    }
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('input', true, Object.assign({
    }, localAttributes, attributes ? attributes.hash : {})));
  }

  /**
   * Select
   * {{form-select 'title' titles person.title}}
   *
   * TODO: Need to support <optgroup label="Options 1"></optgroup>
   * {
   *   100: Name,
   *   200: Address,
   *   300: City,
   * }
   *
   * For optgroups, the object passed in needs to look like
   * {
   *   label: {
   *     100: Name,
   *     200: Address,
   *     300: City,
   *   }
   * }
   *
   * TODO: Add id to the option field by using field-{name}-{value}
   * TODO: Be able to handle if options passed in is just an array
   *
   * @param {string} name - name of field
   * @param {string} options - list of options
   * @param {string} selected - selected item from list of options
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static select(name, options, selected, attributes) {
    // Stub the options HTML string
    let optionsHtml = '';
    // TODO: If options is an array, create a new object with same key and values
    // Loop through each item in options and build <option> tags for each
    Object.keys(options).forEach((value) => {
      const option = {
        value,
        id: `field-${name}-${value}`,
      };
      // Now try to see if the selected="selected" needs to be in there
      if (selected) {
        if ((Array.isArray(selected)
             && HandlebarsFormHelper.indexOf(selected, value) !== -1)
            || selected.toString() === value) {
          option.selected = 'selected';
        }
      }
      optionsHtml += HandlebarsFormHelper.createElement('option', true, option, options[value]);
    });
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('select', true, Object.assign({
      name,
      multiple: Array.isArray(selected) ? 'multiple' : false,
    }, attributes ? attributes.hash : {}), optionsHtml));
  }

  // TODO: Generate dropdown list with a range
  // static selectRange(name, start, end, selected, attributes) {
  // }

  // TODO: Generate dropdown list with a list of months
  // static selectMonth(name, selected, attributes) {
  // }

  // ==================== BUTTONS ====================

  /**
   * Button
   * {{submit "Submit form"}}
   * @param {string} name - name of input field
   * @param {string} body - label to display
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static button(name, body, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('button', true, Object.assign({
      name,
      id: `button-${name}`,
      type: 'button',
    }, attributes ? attributes.hash : {}), body));
  }

  /**
   * Submit
   * {{button "Submit form"}
   * @param {string} name - name of input field
   * @param {string} body - label to display
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static submit(name, body, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('button', true, Object.assign({
      name,
      id: `submit-${name}`,
      type: 'submit',
    }, attributes ? attributes.hash : {}), body));
  }

  /**
   * Image
   * {{image "Submit form"}
   * @param {string} name - name of input field
   * @param {string} body - label to display
   * @param {object} attributes - other attributes
   * @return {string} html
   */
  static image(name, body, attributes) {
    return new Handlebars.SafeString(HandlebarsFormHelper.createElement('button', true, Object.assign({
      name,
      id: `image-${name}`,
      type: 'image',
    }, attributes ? attributes.hash : {}), body));
  }

  // ==================== HELPERS (MARKUP) ====================

  /**
   * Opens an HTML tag
   * @param {string} type - form field type
   * @param {boolean} closing - add closing tag or not
   * @param {object} attributes - html element attributes
   * @return {string} html
   */
  static openTag(type, closing, attributes) {
    const html = [`<${type}`];
    // If there is no id in the attributes, add an 'id' with prefix
    if (!('id' in attributes) && attributes.id !== false) {
      html.push(`id="field-${attributes.name}"`);
    }
    // Loop through each attribute and put in array
    Object.keys(attributes).forEach((name) => {
      // A falsy value is used to remove the attribute.
      // EG: attr[false] to remove, attr['false'] to add
      if (attributes[name]) {
        html.push(`${name}="${attributes[name]}"`);
      }
    });
    return `${html.join(' ')}${(!closing ? ' /' : '')}>`;
  }

  /**
   * Closes an HTML tag
   * @param {string} type - form field type
   * @return {string} html
   */
  static closeTag(type) {
    // return '</' + type + '>';
    return `</${type}>`;
  }

  /**
   * Create a full HTML element
   * @param {string} type - form field type
   * @param {string} closing - form field type
   * @param {object} attributes - attributes
   * @param {string} contents - content of the tag
   * @return {string} html
   */
  static createElement(type, closing, attributes, contents) {
    return this.openTag(type, closing, attributes) + (closing ? (contents || '') + this.closeTag(type) : '');
  }

  // ==================== HELPERS (OBJECT, ARRAY) ====================

  /**
   * Index of
   * @param {array} array - source object
   * @param {string} find - thing to find
   * @return {string} html
   */
  static indexOf(array, find) {
    for (let i = 0, j = array.length; i < j; i += 1) {
      if (array[i].toString() === find) {
        return i;
      }
    }
    return -1;
  }

  // ==================== MAIN REGISTER ====================

  /**
   * Register the helpers
   * @param {handlebars} handlebars - express-handlebars instance
   * @param {object} options - extra options
   * @return {undefined}
   */
  static registerHelpers(handlebars, options) {
    const { namespace } = options;
    const keys = Reflect.ownKeys(this);
    keys.forEach((key) => {
      if (typeof this[key] === 'function' && !(key in [
        'registerHelpers', 'indexOf', 'createElement', 'openTag', 'closeTag',
      ])) {
        handlebars.registerHelper((namespace ? `${namespace}-${key}` : `form-${key}`), this[key]);
      }
    });
  }
}

module.exports = HandlebarsFormHelper;
