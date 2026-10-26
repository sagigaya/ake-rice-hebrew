$(function(){
	$layout_view = $('#layout-view');
	$('#btn-view-grid').click(function(){
		$layout_view
			.removeClass('layout-view-list')
			.addClass('layout-view-grid');
	});
	$('#btn-view-list').click(function(){
		$layout_view
			.removeClass('layout-view-grid')
			.addClass('layout-view-list');
	});
	$('.select-file input[type="checkbox"]').click(function(){
		$(this).closest('.grid-table_row').toggleClass('file-selected');
	});

	// Light Gallery
	 $('#lightgallery').lightGallery();
});