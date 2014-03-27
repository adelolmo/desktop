var tools	=	{
	res: [window.screen.width, window.screen.availHeight],

	/**
	 * Get the best x/y position for a window based on its width/height AND
	 * platform (ie, on top for mac, on bottom for windows).
	 */
	get_popup_coords: function(width, height)
	{
		return {x: tools.res[0] - (width + 6), y: tools.res[1] - (height + 6)};
	},

	/**
	 * attach right-click context menu to images for downloading.
	 */
	attach_image_context_menu: function(win)
	{
		if(!win || !win.document || !win.document.body) return false;
		var body	=	win.document.body;
		body.addEventListener('contextmenu', function(e) {
			var img	=	e.target;
			if(img.tagName.toLowerCase() != 'img' || e.button != 2) return;

			var filename	=	img.src.match(/#name=/) ? img.src.replace(/.*#name=/, '') : 'file';
			var menu		=	new gui.Menu();
			menu.append(new gui.MenuItem({
				label: 'Save image as...',
				click: function() {
					// i love this download hack =]
					var a	=	win.document.createElement('a');
					a.href	=	img.src;
					a.setAttribute('download', filename);
					fire_click(a);
				}
			}));
			menu.popup(e.x, e.y);
		});
	},

	/**
	 * attach copy/paste context menus
	 */
	attach_copy_paste_context_menu: function(win)
	{
		if(!win || !win.document || !win.document.body) return false;
		var body	=	win.document.body;
		body.addEventListener('contextmenu', function(e) {
			var selection	=	win.getSelection();
			var string		=	selection ? selection.toString() : false;

			var clipboard	=	gui.Clipboard.get();
			var paste		=	clipboard.get('text');
			var active		=	win.document.activeElement;

			var menu		=	new gui.Menu();
			var has_items	=	false;
			if(string && string != '')
			{
				menu.append(new gui.MenuItem({
					label: 'Copy',
					click: function() {
						var clipboard	=	gui.Clipboard.get();
						clipboard.set(string, 'text');
					}
				}));
				has_items	=	true;
			}
			if((active.get('tag') == 'input' && !['checkbox', 'radio'].contains(active.get('type'))) || active.get('tag') == 'textarea')
			{
				menu.append(new gui.MenuItem({
					label: 'Paste',
					click: function() {
						insert_text_at(active, paste);
					}
				}));
				has_items	=	true;
			}

			if(!has_items) return false;
			var x	=	e.x;
			var y	=	e.y;

			var curwin	=	gui.Window.get(win);
			var mainwin	=	gui.Window.get();
			x	=	x + (curwin.x - mainwin.x);
			y	=	y + (curwin.y - mainwin.y);

			menu.popup(x, y);
		});
	}
};