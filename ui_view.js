(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.compLog = factory();
	}
}(this, function () {
	require(['domReady', 'assetViewer'], function (domReady, assetViewer) {

	domReady(function () {
		do_hash();
	});

	window.addEventListener('hashchange', function(event){
		do_hash();
	});

	function do_hash() {
		var hash = window.location.hash;
		if (/view=/.test(hash)){
			var cur_id = hash.replace(/#view=/, '');
			//var filepath = decodeURIComponent(hash);
			view(cur_id);
		}
	}

	function view( id ) {
		var container = document.querySelector('#contents');
		var overlay = draw_overlay();
		document.body.appendChild(overlay);
		var h = overlay.querySelector('.layerHeader');
		var c = overlay.querySelector('.layerContent');
		var p = overlay.querySelector('.layerPanel');
		h.innerHTML = id;
		var close = document.createElement('span');
		close.setAttribute('class', 'layerButtons');
		close.innerHTML = 'X';
		c.innerHTML = 'VIEWER';
		assetViewerSelector('/api/file'+id, c);
		h.appendChild(close);
 		close.addEventListener('click', function(e){
 			overlay.remove();
			var previousHash = window.previousHash || '';
			window.previousHash = location.hash;
			location.hash = previousHash;
			window.processHash = true;
			//window.history.back();
			//location.hash = window.previousHash[window.previousHash.length-2];
		});
		//damas.read(id, function(n){
		//});
		damas.search('#parent:'+id, function(children_ids){
			damas.read(children_ids, function(children_n){
				for (var i= 0; i < children_n.length ; i++){
					p.appendChild(node_list_item(children_n[i]));
				}
			});
		});
	}

	function node_list_item( node ) {
		var i = document.createElement('li');
		var d1 = document.createElement('span');
		var d2 = document.createElement('span');
		var d3 = document.createElement('div');
		d1.setAttribute('class', 'nodeListItem');
		d1.setAttribute('class', 'author');
		d2.setAttribute('class', 'time');
		d3.setAttribute('class', 'comment');
		i.appendChild(d1);
		i.appendChild(d2);
		i.appendChild(d3);
		d1.innerHTML = node.author;
		d2.innerHTML = html_time(new Date(node.time));
		d3.innerHTML = node.comment;
		return i;

	}

	function draw_overlay(){
		var l = document.createElement('div');
		var h = document.createElement('div');
		var w = document.createElement('div');
		var c = document.createElement('div');
		var p = document.createElement('div');
		l.appendChild(h);
		l.appendChild(w);
		w.appendChild(c);
		w.appendChild(p);
		l.setAttribute('class', 'flexlayer');
		h.setAttribute('class', 'layerHeader');
		h.classList.add('titlebar');
		w.setAttribute('class', 'layerWrapper');
		c.setAttribute('class', 'layerContent');
		p.setAttribute('class', 'layerPanel');
		return l;
	}

	});
}));
