/**
 * @author  Hamza Waqas <hamzawaqas@live.com>
 * @since   9/8/14
 */

(function() {
    "use strict";

    var _ = require('lodash');

    var Group = function(Inherits, config) {

        this.config = config;

        Inherits(this);

        var postFields = [
            'creation-timestamp', 'title', 'summary' ,
            'creator:(first-name,last-name,picture-url,headline)', 'likes',
            'attachment:(image-url,content-domain,content-url,title,summary)',
            'relation-to-viewer'
        ], groupFields = [
            'id', 'name', 'short-description', 'description', 'relation-to-viewer:(membership-state,available-actions)', 
            'posts', 'counts-by-category', 'is-open-to-non-members', 'category,website-url', 
            'locale,location:(country,postal-code)', 'allow-member-invites', 'site-group-url', 'small-logo-url', 'large-logo-url'
        ]
        , params = {
            start: 0,
            count: 10,
            order: 'recency',
            category: 'discussion'
        };

        this.feeds = function(gid, _postFields, _params, cb) {
            if (_.isFunction(_postFields)) {
                // No Fields or Parameters passed.
                cb = _postFields;
                _postFields = postFields;
                _params = params;
            }

            if (_.isFunction(_params)) {
                // Fields is available but not params.
                cb = _params;
                _params = params;
            }

            this.createCall('GET', 'groups/' + gid + '/posts:(' + _postFields.join(',') +")", _params, cb)(this.config);
        };

        this.hasMembership = function(options, cb) {
            this.createCall('GET', 'people/~/group-memberships:(group:())', options, cb)(this.config);
        };

        this.canPost = function(cb) {
            this.createCall('GET', 'people/~/group-memberships:(group:(' + groupFields.join(',') + '))', { 'available-actions' : 'add-post' }, cb)(this.config);
        };

        this.info = function(gid, options, cb) {
            this.createCall('GET', 'groups/' + gid + ':(' + groupFields.join(',') + ')', options, cb)(this.config)
        };

        this.share = function(id, options, cb) {
            this.createCall('POST', 'groups/' + id + '/posts', options, cb)(this.config);
        };

        return this;
    }.bind(this);

    module.exports = Group;
}).call(this);