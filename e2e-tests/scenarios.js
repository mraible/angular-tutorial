'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/view1");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/view1');
    });


    it('should render view1 when user navigates to /view1', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
    
  describe('search', function() {
    var searchTerm = element(by.model('term'));
    var searchButton = element(by.id('search'));

    beforeEach(function() {
      browser.get('index.html#/search');
    });

    it('should allow searching at /search', function() {
      searchTerm.sendKeys("M");
      searchButton.click().then(function() {
        expect(element.all(by.repeater('person in searchResults')).count()).toEqual(3);
      });
    });
  });

  describe('edit person', function() {
    var name = element(by.model('person.name'));
    var street = element(by.model('person.address.street'));
    var city = element(by.model('person.address.city'));

    beforeEach(function() {
      browser.get('index.html#/edit/1');
    });

    it('should allow viewing a person', function() {
      // getText() doesn't work with input elements, see the following for more information:
      // https://github.com/angular/protractor/blob/master/docs/faq.md#the-result-of-gettext-from-an-input-element-is-always-empty
      expect(name.getAttribute('value')).toEqual("Peyton Manning");
      expect(street.getAttribute('value')).toEqual("1234 Main Street");
      expect(city.getAttribute('value')).toEqual("Greenwood Village");
    });
  });

  describe('save person', function() {
    var name = element(by.model('person.name'));
    var save = element(by.id('save'));

    beforeEach(function() {
      browser.get('index.html#/edit/1');
    });

    it('should allow updating a name', function() {
      name.sendKeys(" Updated");
      save.click().then(function() {
        // verify url set back to search results
        browser.driver.wait(function() {
          return browser.driver.getCurrentUrl().then(function(url) {
            expect(url).toContain('/search/Peyton%20Manning%20Updated');
            return url;
          });
        });
        // verify one element matched this change
        expect(element.all(by.repeater('person in searchResults')).count()).toEqual(1);
      });
    });
  });
});
