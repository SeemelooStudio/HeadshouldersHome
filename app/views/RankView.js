// RankView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Rank.html", "utils"],

    function ($, Backbone, Mustache, template, Utils) {

        var RankView = Backbone.View.extend({

            el: ".leaderboardContainer",

            initialize: function (options) {

                this.user = options.user;
                this.model.set(this.user.toJSON());

                if (Utils.isMsie()) {
                    this.scrollTag = "html";
                } else {
                    this.scrollTag = "body";
                }

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
                console.log(this.model.toJSON());
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));

                this.trigger("render");

                return this;

            },

            postRender: function () {
                var top = $("#leaderboard-main").offset().top - 50;
                var self = this;
                var $win = $(window);
                $win.unbind("scroll");
                $(self.scrollTag).animate({
                    scrollTop: top
                }, 500, function () {
                    //scroll up
                    $win.on("scroll", function () {
                        if ($win.scrollTop() < (top - 150)) {
                            $(self.scrollTag).animate({
                                scrollTop: 0
                            }, 500,
                            function () {
                                $("#leaderboard").removeClass("expand");
                                $(".leaderboardPrize").hide();
                                Backbone.history.navigate("", { trigger: false, replace: true });
                            });
                            $win.unbind("scroll");
                        }
                    });
                }
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