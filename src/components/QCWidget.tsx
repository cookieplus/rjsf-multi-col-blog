import {RJSFSchema, UiSchema, WidgetProps, RegistryWidgetsType} from '@rjsf/utils';

const QCWidget = function (props: WidgetProps) {
	const images = [{url: '/img/road.jpg'}];

	// const a = props.formData.left.qcImageSet;
	return (
			<div className="image-list">
				{images.map((image, index) => (
						<img key={index} src={image.url} alt={`Image ${index}`} className="image-item"
							 style={{
								 width: '100%', // Đảm bảo ảnh chiếm toàn bộ chiều rộng của container
								 height: undefined, // Để ảnh tự động điều chỉnh chiều cao dựa trên chiều rộng
								 aspectRatio: 1, // Giữ nguyên tỷ lệ ảnh, thay đổi giá trị này tùy theo yêu cầu
								 // resizeMode: 'contain', // Đảm bảo ảnh không bị cắt và giữ nguyên tỷ lệ
								 // marginVertical: 10, // Thêm khoảng cách giữa các ảnh
							 }} />
				))}
			</div>
	);
};
export default QCWidget;
