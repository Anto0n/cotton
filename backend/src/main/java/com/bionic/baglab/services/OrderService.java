package com.bionic.baglab.services;

import com.bionic.baglab.dao.OrderDao;
import com.bionic.baglab.dao.OrderStatusDao;
import com.bionic.baglab.domains.*;
import com.bionic.baglab.dto.enums.OrderStatusNameEnum;
import com.bionic.baglab.dto.order.OrderDto;
import com.bionic.baglab.dto.order.OrderDtoCreate;
import com.bionic.baglab.dto.order.OrderDtoUpdate;
import com.bionic.baglab.dto.order.OrderItemDtoCreate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private OrderStatusDao orderStatusDao;

    @Autowired
    private ModelService modelService;

    @Autowired
    private BagTypeService bagTypeService;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private UserService userService;

    public Set<OrderDto> findAll() {
        List<OrderEntity> temp = orderDao.findAll();
        return temp.stream().map(OrderDto::new).collect(Collectors.toSet());
    }

    public OrderEntity findOne(Long id) {
        return orderDao.findOne(id);
    }

    public OrderStatusEntity findOrderStatusById(Long id) {
        return orderStatusDao.findOne(id);
    }

    public OrderStatusEntity findOrderStatusByName(OrderStatusNameEnum name){
        return orderStatusDao.findByCode(name);
    }

    @Transactional
    public OrderEntity save(OrderEntity orderEntity) {
        return orderDao.save(orderEntity);
    }

    public List<OrderDto> getAllOrdersByStatus(OrderStatusNameEnum status) {        // didnt work??
        List<OrderEntity> ordersEntities = orderDao.findAllOrdersByOrderStatusCode(status.name());
        return ordersEntities.stream().map(OrderDto::new).collect(Collectors.toList());
    }

    public Set<OrderDto> getAllOrdersByUserId(long userId) {
        List<OrderEntity> temp = orderDao.findAllByUserIdUser(userId);
        return temp.stream().map(OrderDto::new).collect(Collectors.toSet());
    }

    public  Set<OrderDto> getOrderByUserIdAndStatus(long userId, OrderStatusNameEnum statusCode) {
        List<OrderEntity> temp = orderDao.findAllOrderByUserIdUserAndOrderStatusCode(userId, statusCode );
        return temp.stream().map(OrderDto::new).collect(Collectors.toSet());
    }

    /**
     * create Order with status "BUCKET"
     * @param orderDto
     * @return
     */
    public OrderDto createOrder(OrderDtoCreate orderDto) {
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setUser(userService.findEntityById(orderDto.getUserId()));
        orderEntity.setOrderStatus(orderStatusDao.findByCode(OrderStatusNameEnum.BUCKET));
        orderEntity.setItems(orderDto.getItems()
                .stream()
                .map(this::orderItemDto2Entity)
                .collect(Collectors.toList())
        );

        OrderEntity resOrderEntity = save(orderEntity);

        return getDtoFromEntity(resOrderEntity);
    }


    private OrderItemEntity orderItemDto2Entity(OrderItemDtoCreate orderItemDto) {
        Long modelId = orderItemDto.getModelId();

        ModelEntity modelEntity = modelService.findOne(modelId);
        BagTypeEntity bagTypeEntity = bagTypeService.findOne(modelEntity.getBagTypeId());
        MaterialEntity materialEntity = materialService.findOne(modelEntity.getMaterialId());
        int modelPrice = bagTypeEntity.getLastPrice() + materialEntity.getLastPrice();

        int count = orderItemDto.getCount();
        int orderItemPrice = modelPrice * count;

        return new OrderItemEntity(modelEntity, count, orderItemPrice);
    }

    private OrderDto getDtoFromEntity(OrderEntity orderEntity) {
        OrderDto orderDto = new OrderDto(orderEntity);
        return orderDto;
    }

    public OrderDto changeStatus(long orderId, OrderStatusNameEnum orderStatusNameEnum) {
        OrderEntity orderEntity = findOne(orderId);
        orderEntity.setOrderStatus(findOrderStatusByName(orderStatusNameEnum));
        orderEntity.setOrderUpdate(Timestamp.from(Instant.now()));

        return getDtoFromEntity(orderEntity);
    }

    public OrderDto changeOrder(OrderDtoUpdate orderDto) {
        OrderEntity orderEntity = findOne(orderDto.getOrderId());
        // orderEntity.setOrderStatus(orderStatusDao.findByCode("processing")); Do not change orderStatus while uptating Order
        orderEntity.setItems(orderDto.getItems()
                .stream()
                .map(this::orderItemDto2Entity)
                .collect(Collectors.toList())
        );
        OrderEntity resOrderEntity = save(orderEntity);
        return getDtoFromEntity(resOrderEntity);
    }

    public void deleteOrder(long orderId) {
        orderDao.delete(orderId);
    }




}
