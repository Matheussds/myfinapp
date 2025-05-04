import { getCards } from "@api/cards";
import { Card } from "@entity";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormAddCard from "./AddCardForm";

interface Props {
    onSelect: (card: Card) => void;
    onCancelAddCard: () => void;
}

export default function CardList({ onSelect, onCancelAddCard }: Props) {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<number>(-1);
    const [openCardForm, setOpenCardForm] = useState<boolean>(false);

    const onSetCard = (index: number) => {
        setSelectedCard(index);
        const card = cards[index];
        onSelect(card);
        console.log(card);
    }

    const loadCards = async () => {
        try {
            const cards = await getCards();
            setCards(cards);
        } catch (error) {
            console.error("Error loading cards:", error);
        }
    }

    const handleAddCard = (card: Card) => {
        setCards([...cards, card]);
        setOpenCardForm(false);


        useEffect(() => {
            loadCards();
        }, []);
    }
    return (
        <View style={{ width: '100%', alignItems: "center" }}>
            {(openCardForm || cards.length == 0) ?
                <FormAddCard onAddCard={handleAddCard} onCancel={() => onCancelAddCard()} />
                :
                <>
                    <FlatList
                        data={cards}
                        keyExtractor={(item) => item.guid || ""}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={item.guid}
                                style={[styles.button, styles.cardButton, selectedCard === index ? styles.cardSelected : styles.card]}
                                onPress={() => onSetCard(index)}
                            >
                                <Text style={styles.buttonText}>
                                    {typeof item.name === "string" && item.name.trim() !== ""
                                        ? item.name
                                        : `Cartão ${index + 1}`}
                                </Text>
                            </TouchableOpacity>
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 10, alignItems: 'center' }}
                    />
                    <Button title="Adicionar um cartão" onPress={() => setOpenCardForm(true)} />
                </>
            }
        </View>
    );

}

const styles = StyleSheet.create({
    button: {
        width: '50%',
        padding: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
    },
    cardButton: {
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    card: {
        width: 120,
        height: 70,
        backgroundColor: '#820AD1'
    },
    cardSelected: {
        width: 130,
        height: 80,
        backgroundColor: '#052BC2',
        borderColor: '#052BC2',
        borderWidth: 2
    }
})