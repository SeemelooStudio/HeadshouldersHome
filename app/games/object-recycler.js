function ObjectRecycler(creator, initCapacity, onAlloc, onFree)
{
	var objects;
	var self = this;

	//! class constructor
	var Constructor = function()
	{
		objects = new Array();

		if (initCapacity == null ) { return; }
		for( var i = 0; i < initCapacity; i++)
		{
			var obj = creator();
			obj.active = false;
			objects.push( obj );
		}
	};

	self.alloc = function() {
		var obj = null;
		for (var i = 0; i < objects.length; i++)
		{
			if (objects[i].active == false)
			{
				obj = objects[i];
				break;
			}
		}
		if (obj == null)
		{
			obj = creator();
			objects.push(obj);
		}

		obj.active = true;

		if (onAlloc != null)
		{
			onAlloc(obj);
		}

		return obj;
	};

	self.free = function(obj) {
		if ( onFree != null )
		{
			onFree( obj )
		}
		obj.active = false
	};

	self.freeAll = function() {
		for (var i = 0; i < objects.length; i++)
		{
			self.free(objects[i]);
		}
	};

	self.size = function() {
		return objects.length;
	};

	Constructor();
}

return ObjectRecycler;
