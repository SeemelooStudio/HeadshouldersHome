// RankView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Rank.html"],

    function ($, Backbone, Mustache, template) {

        var RankView = Backbone.View.extend({

            el: ".leaderboardContainer",

            initialize: function (options) {

                this.user = options.user;
                this.model.set(this.user.toJSON());

                this.listenTo(this, "render", this.postRender);
                this.render();
            },

            events: {
            },

            // Renders the view's template to the UI
            render: function () {
                this.template = _.template(template, {});

                var accumulateList = this.model.get("accumulatePointsRankList");
                var scoreGap = accumulateList[accumulateList.length - 1].score - this.user.get("accumulatePoints");
                this.model.set("accumulatePointsGap", scoreGap);

                this.$el.html(Mustache.render(this.template, this.model.toJSON()));

                this.trigger("render");

                return this;

            },

            postRender: function () {
                var top = $("#leaderboard-main").offset().top;
                $('body').animate({
                    scrollTop: top
                }, 500
                );
                //add class to first three lines
                this.$el.find('.leaderboard-list').each(function () {
                    $(this).find('.leaderboard-item').first().next().addClass('first').next().addClass('second').next().addClass('third');
                });

                if (this.model.get("accumulateLeader")) {
                    this.highLightUser("#leaderboard-score", this.model.get("accumulatePointsRanking"));
                }

                if (this.model.get("passGameLeader")) {
                    this.highLightUser("#leaderboard-pass", this.model.get("passGameRanking"));
                }

                if (this.model.get("dribbleGameLeader")) {
                    this.highLightUser("#leaderboard-dribble", this.model.get("dribbleGameRanking"));
                }

                if (this.model.get("shootGameLeader")) {
                    this.highLightUser("#leaderboard-shoot", this.model.get("shootGameRanking"));
                }
            },
            highLightUser: function (leaderboardId, rank) {
                this.$el.find(leaderboardId + " .leaderboard-list").children(".leaderboard-item:eq(" + rank + ")").addClass("leaderboard-me");
            }
        });

        // Returns the View class
        return RankView;
    }

);