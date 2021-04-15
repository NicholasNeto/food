import { useEffect, useState } from 'react';
import api from '../../services/api';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import { ModalAddFood } from '../../components/ModalAddFood';
import { Header } from '../../components/Header';
import { Food } from '../../components/Food';

interface FoodType {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

interface InputFoodType {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}


export default function Dashboard() {

  const [foods, setFoods] = useState([] as FoodType[])
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState({} as InputFoodType)


  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.get('/foods');
      setFoods(response.data);
    }
    fetchFoods()
  }, [])


  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  async function handleAddFood(food: InputFoodType) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  async function handleUpdateFood(food: InputFoodType) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered)
  }

  function handleEditFood(food: InputFoodType) {
    setEditingFood(food)
    setModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              onHandleDelete={handleDeleteFood}
              onHandleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}