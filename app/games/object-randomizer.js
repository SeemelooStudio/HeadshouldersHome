define(["crafty"],
function (Crafty) {

// use this component to get rondom element from a list
Crafty.c('ObjectRandomizer', {
	init : function() {},

    ObjectRandomizer : function(objects, probabilities, debug) {
	    var self = this;
		self.objects = objects;
		self.debug = debug;

		if (probabilities == null)
		{
			self.isEven = true;
		}
		else
		{
			if (objects.length != probabilities.length + 1)
			{
				console.log("ERROR: (Count of probability numbers) must be (count of elements - 1)");
				return;
			}

			var sum = 0;
			for(var i = 0; i < probabilities.length; i++)
			{
				sum += probabilities[i];
			}
			if (sum > 1)
			{
				console.log("ERROR: Probabilities' sum must be less than 1");
				return;
			}

			self.isEven = false;
			self.probabilityBounds = new Array();

			var debugStr = "{ ";
			for ( var i = 0; i < objects.length; i++)
			{
                if (i < objects.length - 1)
                {
                    var probability = probabilities[i];
                    self.probabilityBounds.push(i == 0 ? probability : self.probabilityBounds[i - 1] + probability);
                }
                else
                {
                    self.probabilityBounds.push(1);
                }

                debugStr += (i == 0 ? ("[0 - " + self.probabilityBounds[0] + "] ") : 
                                      ("[" + self.probabilityBounds[i - 1] + " - " + self.probabilityBounds[i] + "] "));
			}

            debugStr += "}";

            if (self.debug)
            {
                console.log(debugStr);
            }
		}

        return self;
	},

	get : function() {
		var self = this;
		if ( self.objects == null || self.objects.length == 0)
		{
			return null;
		}

		if (self.isEven)
		{
		    var seed = Math.floor(Crafty.math.randomNumber(0, self.objects.length));
			return self.objects[seed];
		}
		else
		{
			var number = Math.random();
			if (number < self.probabilityBounds[0])
			{
				if (self.debug)
				{
					console.log("random number [" + number + "] is in range [0," +
						self.probabilityBounds[0] + "], return[" + self.objects[0] + "]");
				}
				return self.objects[0];
			}
			else
			{
				for (var i = 1; i < self.probabilityBounds.length; i++)
				{
					if (number > self.probabilityBounds[i - 1] &&
						number <= self.probabilityBounds[i])
					{
						if (self.debug)
						{
							console.log("random number [" + number + "] is in range [" +
								self.probabilityBounds[i - 1] + "," + self.probabilityBounds[i] +
								"], return[" + self.objects[i] + "]");
						}
						return self.objects[i];
					}
				}
				console.log("ERROR: code should never run here");
				return null;
			}
		}
	}
});

});
