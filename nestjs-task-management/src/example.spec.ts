// feature
class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name)
        this.announceFriendship(name)
    }

    announceFriendship(name) {
        global.console.log(`${name} is now a friend!`)
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name)

        if(idx === -1) {
            throw new Error('Friend not found!');
        }

        this.friends.splice(idx, 1)
    }
}

// tests
describe('FiendList', () => {
    let friendsList = new FriendsList();

    beforeEach(() => {
        friendsList = new FriendsList();
    })

    it('initializes friends list', () => {

        expect(friendsList.friends.length).toEqual(0)
    })

    it('adds a friend to the list', () => {
        friendsList.addFriend('hung oi');

        expect(friendsList.friends.length).toEqual(1)
    })

    it('announces friendship', () => {
        friendsList.announceFriendship = jest.fn();
        expect(friendsList.announceFriendship).not.toHaveBeenCalled();
        friendsList.addFriend('Ariel')

        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Ariel')
    })

    describe('removeFriend', () => {
        it('removes a friend from the list', () => {
            friendsList.addFriend('Ariel');
            expect(friendsList.friends[0]).toEqual('Ariel')
            friendsList.removeFriend('Ariel')
            expect(friendsList.friends[0]).toBeUndefined()
        })

        it('throws a error as friend does not exit', () => {
            expect(() => friendsList.removeFriend('Ariel')).toThrow(new Error('Friend not found!'))
        })
    })
})