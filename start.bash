## a script to start the nestjs proxy caching server, it has to edit the .env file
## to set the correct values for the server to run
## env has PORT and FORWARD_URL
## sample usage : ./start.bash --port 3000 --forward-url http://localhost:3001
## or ./start.bash -p 3000 -f http://localhost:3001

# get the arguments PORT and FORWARD_URL
while [ "$1" != "" ]; do
    case $1 in
        -p | --port )           shift
                                PORT=$1
                                ;;
        -f | --forward-url )    shift
                                FORWARD_URL=$1
                                ;;
        * )                     echo "Invalid argument"
                                exit 1
    esac
    shift
done

# debug statement to check the value of PORT
echo "PORT is set to: $PORT"

# check if the port has been set
if [ -z "$PORT" ]; then
    echo "Error: PORT is not set. Use -p or --port to specify the port."
    exit 1
fi

# debug statement to check the value of FORWARD_URL
echo "FORWARD_URL is set to: $FORWARD_URL"

# check if the forward url has been set
if [ -z "$FORWARD_URL" ]; then
    echo "Error: FORWARD_URL is not set. Use -f or --forward-url to specify the forward url."
    exit 1
fi

# check if the .env file, if exists clear it if not create it
if [ -f .env ]; then
    echo "" > .env
else
    touch .env
fi

# set the values in the .env file
echo "PORT='$PORT'" > .env
echo "FORWARD_URL='$FORWARD_URL'" >> .env

# execute command in console to start the server
npm run build
npm run start:dev

# end of script