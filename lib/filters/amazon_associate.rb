# frozen_string_literal: true

require "nokogiri"
require "html/pipeline/filter"

module Filters
  class AmazonAssociate < HTML::Pipeline::Filter
    def call
      doc.search("p").each do |element|
        next unless element.children.size == 1
        next unless element.child.name == "a"
        next unless %r{^https://www\.amazon\.co\.jp/dp/(?<id>\w+)$} =~ element.child.text
        element.replace asin_node(id)
        sleep 1
      end
      doc
    end

    def asin_node(id)
      Asin.new(id).build_node
    end

    class Asin
      MAX_RETRY = 5
      RETRY_INTERVAL = 10

      attr_reader :id

      def initialize(id)
        @id = id
      end

      def build_node
        Nokogiri::HTML.fragment(html)
      end

      def html
        <<-HTML
          <div class="asin">
            <div class="asin-image">
              <a href="#{url}"><img src="#{image_url}" alt="#{title}" title="#{title}"></a>
            </div>
            <div class="asin-detail">
              <p><a href="#{url}">#{title}</a></p>
              <ul>
                <li>#{authors.join(', ')}</li>
                <li>#{manufacturer}</li>
              </ul>
            </div>
          </div>
        HTML
      end

      private

      def authors
        item.get_array("ItemAttributes/Author")
      end

      def image_url
        "http://images-jp.amazon.com/images/P/#{id}.09._SL160_.jpg"
      end

      def manufacturer
        item.get("ItemAttributes/Manufacturer")
      end

      def title
        item.get("ItemAttributes/Title")
      end

      def url
        "https://www.amazon.co.jp/exec/obidos/ASIN/#{id}/#{tracking_id}/"
      end

      def item
        @item ||= lookup.items.first
      end

      def lookup(retry_count: MAX_RETRY)
        Amazon::Ecs.item_lookup(id)
      rescue Amazon::RequestError => e
        $stderr.puts "failed to lookup (retry_count #{retry_count})"
        $stderr.puts e.class
        $stderr.puts e.message
        if retry_count > 0
          retry_count -= 1
          sleep(RETRY_INTERVAL)
          retry
        end
        raise e
      end

      def tracking_id
        @tracking_id ||= "#{Amazon::Ecs.options[:associate_tag]}-22"
      end
    end
  end
end
